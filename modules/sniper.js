const { MessageEmbed } = require('discord.js');

module.exports = async (bot) => {
    bot.sniper.snipes = {};
    bot.sniper.editSnipes = {};
    bot.sniper.reactionSnipes = {};

    bot.sniper.formatEmoji = (emoji) => {
        return !emoji.id || emoji.available
            ? emoji.toString() // bot has access or unicode emoji
            : `[[${emoji.name}]](${emoji.url})`; // bot cannot use the emoji
    };

    bot.on('messageDelete', async (message) => {
        if (message.partial || (message.embeds.length && !message.content)) return; // content is null or deleted embed
        if (message.author.bot) return;

        bot.sniper.snipes[message.channel.id] = {
            type: 'snipe',
            author: message.author,
            content: message.content,
            createdAt: message.createdTimestamp,
            image: message.attachments.first() ? message.attachments.first().proxyURL : null,
        };
    });

    bot.on('messageUpdate', async (oldMessage, newMessage) => {
        if (oldMessage.partial) return; // content is null
        if (oldMessage.author.bot) return;

        bot.sniper.editSnipes[oldMessage.channel.id] = {
            type: 'snipedit',
            author: oldMessage.author,
            content: oldMessage.content,
            createdAt: newMessage.editedTimestamp,
        };
    });

    bot.on('messageReactionRemove', async (reaction, user) => {
        if (reaction.partial) reaction = await reaction.fetch();
        if (user.bot) return;

        bot.sniper.reactionSnipes[reaction.message.channel.id] = {
            type: 'snipreact',
            user: user,
            emoji: reaction.emoji,
            messageURL: reaction.message.url,
            createdAt: Date.now(),
        };
    });
};
