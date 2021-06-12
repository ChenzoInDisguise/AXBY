const channelFile = new (require('../util/file'))('channels.json');

module.exports = {
  command: 'ax',
  guild: true,
  permissions: (member) => {
    return (
      member.id == '401376663541252096' || member.id == '245739603909279745'
    );
  },
  async execute(bot, msg, args) {
    if (!args[0]) {
      return msg.channel.send('Please enter an alias for this command.');
    }
    const channels = channelFile.read();
    channels.push({
      from: msg.channel.id,
      alias: args[0],
      to: []
    });

    channelFile.write(channels);

    await msg.channel.send(`Alias ${args[0]} has been set to ${msg.channel}.`);
  }
};
