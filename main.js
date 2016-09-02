const TGCLI = require('tg-cli-node');
const urlRegex = require('url-regex');
const normalizeUrl = require('normalize-url');
const config = require('./config');
const whitelist = require('./whitelist');

const regex = /\b(http|https)?(:\/\/)?(\S*)\.((?![0-9])\w{2,4})\b/ig;

const chats = [
  154721957
];

const Client = new TGCLI(config);
Client.connect(connection => {
  connection.on('message', msg => {
    try {
      const isWhitelistUser = (whitelist.users.indexOf(msg.from.peer_id) !== -1) || (whitelist.users.indexOf(msg.from.username) !== -1);
      if (msg.text && !isWhitelistUser && chats.indexOf(msg.to.peer_id) > -1) {
        const urls = msg.text.match(regex);
        if (!urls) return;
        for (let i = 0; i < urls.length; ++i) {
          console.log(whitelist.links.indexOf(normalizeUrl(urls[i])))
          if (whitelist.links.indexOf(normalizeUrl(urls[i])) === -1) {
            connection.delete_msg(msg.id);
          }
        }
      }
    } catch (e) {
      console.log(e)
    }
  });

  connection.on('error', e => {
    console.log('Error from Telegram API:', e);
  });

  connection.on('disconnect', () => {
    console.log('Disconnected from Telegram API');
  });
});