const { PREFIX } = require('./../util/globals.js');
const emojis = require('../emojis.json');
const channelFile = new (require('../util/file'))('channels.json');
const { MessageEmbed } = require('discord.js');

let recentCommands = [];

module.exports = async (bot, msg) => {
  if (msg.author.bot) return;

  const axby = channelFile.read().find((axby) => axby.from == msg.channel.id);

  if (axby) {
    try {
      for (let emoji of Object.keys(emojis)) {
        msg.content = msg.content.replace(emoji, emojis[emoji]);
      }

      const embed = new MessageEmbed().setDescription(
        msg.content.split('\n').slice(0, -1)
      );

      const text = msg.content.split('\n').slice(-1);

      for (let channelId in axby.to) {
        const channel = bot.channels.cache.get(channelId);
        if (channel) {
          channel.send(text, embed);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  let args = [].concat
    .apply(
      [],
      msg.content
        .slice(PREFIX.length)
        .trim()
        .split('"')
        .map(function (v, i) {
          return i % 2 ? v : v.split(' ');
        })
    )
    .filter(Boolean);
  let message = msg.content.substring(0);

  if (message.substring(0, PREFIX.length) == PREFIX) {
    const command =
      bot.commands.get(args[0]) ||
      bot.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(args[0]));

    if (command) {
      try {
        if (command.guild && !msg.guild) {
          return msg.channel.send('You can only use this command in a server.');
        }
        if (command.permissions && !command.permissions(msg.member)) {
          return msg.channel.send('Access denied.');
        }
        if (command.dm && msg.guild) {
          return msg.channel.send('You can only use this command in DMs.');
        }
        if (recentCommands.includes(`${msg.author.id}-${command.name}`)) {
          return msg.channel.send(
            command.cdMsg
              ? command.cdMsg
              : 'You are using this command too quicky!'
          );
        }

        recentCommands.push(`${msg.author.id}-${command.name}`);
        setTimeout(
          () => {
            recentCommands = recentCommands.filter(
              (c) => c != `${msg.author.id}-${command.name}`
            );
          },
          command.cooldown ? command.cooldown : 1000
        );

        await command.execute(
          bot,
          msg,
          args.slice(1).filter((a) => a != ''),
          () => {
            recentCommands = recentCommands.filter(
              (c) => c != `${msg.author.id}-${command.name}`
            );
          }
        );
      } catch (err) {
        console.error(err);
        msg.channel.send(
          `There was an error trying to execute the ${args[0]} command!`
        );
      }
    }
  }
};
