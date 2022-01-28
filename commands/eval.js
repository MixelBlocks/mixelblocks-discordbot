module.exports.run = async (bot, message, label, args, prefix) => {
    const Discord = moduleRequire('discord.js');

    return new Promise(async (resolve, reject) => {
        try {
            if (message.author.id != '427212136134213644') return resolve(false);
            eval(args.join(' '));
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

module.exports.aliases = [];
