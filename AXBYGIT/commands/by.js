const channelFile = new (require('../util/file'))('channels.json');

module.exports = {
  command: 'by',
  guild: true,
  permissions: (member) => {
    return member.hasPermission('MANAGE_CHANNELS');
  },
  async execute(bot, msg, args) {
    const channels = channelFile.read();
    const axby = channels.find((axby) => axby.alias == args[0]);
    if (!axby)
      return msg.channel.send('Channel matching alias provided is not found.');

    if (axby.to.includes(msg.channel.id)) {
      axby.to.splice(axby.to.indexOf(msg.channel.id), 1);
      await msg.channel.send(
        `${args[0]} content will no longer be forwarded to this channel.`
      );
    } else {
      axby.to.push(msg.channel.id);
      await msg.channel.send(
        `${args[0]} content will now be forwarded to this channel.`
      );
    }

    channelFile.write(channels);
  }
};
