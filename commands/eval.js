module.exports.run = async (bot, message, label, args, prefix) => {
    const Discord = moduleRequire('discord.js');

    try {
        if (!author.id != '427212136134213644') return;
        eval(args.join(' '));
    } catch (error) {
        bot.error('Error in Eval Command.', error);
        try {
            let errorEmbed = new Discord.MessageEmbed();
            errorEmbed.setTitle('Error!');
            errorEmbed.setDescription('```' + error.stack.slice(0, 1990) + '```');
            errorEmbed.setColor('#ff0000');
            message.channel.send({ embeds: [errorEmbed] });
        } catch (err) {
            bot.logger.logError(err);
        }
    }
};

module.exports.active = true;
module.exports.similarityCheck = false;

module.exports.aliases = [];
