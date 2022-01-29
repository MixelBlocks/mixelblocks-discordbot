module.exports.run = async (bot, message, label, args, prefix) => {
    const Discord = moduleRequire('discord.js');

    return new Promise(async (resolve, reject) => {
        try {
            if (message.author.id != '427212136134213644' && !message.member.permissions.has('ADMINISTRATOR')) {
                bot.usage(message, 'Permission Error', 'Du kannst den bot nicht neu starten!');
                return resolve(false);
            }
            if (!bot.restart) {
                bot.reply(message, 'The Bot will restart in 10 seconds...', (sent) => {
                    bot.restart = Date.now() + 10000;
                    setTimeout(() => {
                        bot.restartCommandUsed = {
                            when: Date.now(),
                            channel: message.channel.id,
                        };
                        process.exit();
                    }, 10000);
                });
            } else {
                bot.usage(message, 'Restart in progress...', `Der bot startet in **${(bot.restart - Date.now()) / 1000}** Sekunden neu.`);
            }
        } catch (error) {
            bot.error('Error in CommandName Command.', error);
            try {
                let errorEmbed = new Discord.MessageEmbed();
                errorEmbed.setTitle('Error!');
                errorEmbed.setDescription('```' + error.stack.slice(0, 1990) + '```');
                errorEmbed.setColor('#ff0000');
                message.channel.send({ embeds: [errorEmbed] });
            } catch (err) {
                bot.logger.logError(err);
            }
            return resolve(false);
        }
        return resolve(true);
    });
};

module.exports.active = true;
module.exports.similarityCheck = false;

module.exports.aliases = ['rs'];

module.exports.help = {
    name: 'eval',
    category: 'devtools',
    aliases: this.aliases,
    active: this.active,
    description: 'Dieser Command erlaubt Serverseitig ausgeführten JavaScript code.',
    usage: '{prefix}{name} <args>',
};
