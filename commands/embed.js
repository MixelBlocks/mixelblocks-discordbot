/*
 * mixelblocks-discordbot | Copyright (C) 2022 | mixelblocks.de
 * Licensed under the MIT License
 *
 *
 *              $$\                  $$\\$\      $$\                  $$\                       $$\
 *              \__|                 $$ $$ |     $$ |                 $$ |                      $$ |
 * $$$$$$\\$$$\ $$\\$\   $$\ $$$$$$\ $$ $$$$$$$\ $$ |$$$$$$\  $$$$$$$\$ |  $$\ $$$$$$$\   $$$$$$$ |$$$$$$\
 * $$  _$$  _$$\\$ \\$\ $$  $$  __$$\\$ $$  __$$\\$ $$  __$$\\$  _____$$ | $$  $$  _____| $$  __$$ $$  __$$\
 * $$ / $$ / $$ $$ |\\$$$  /$$$$$$$$ $$ $$ |  $$ $$ $$ /  $$ $$ /     $$$$$$  /\\$$$$$\   $$ /  $$ $$$$$$$$ |
 * $$ | $$ | $$ $$ |$$  $$< $$   ____$$ $$ |  $$ $$ $$ |  $$ $$ |     $$  _$$<  \____$$\  $$ |  $$ $$   ____|
 * $$ | $$ | $$ $$ $$  /\\$\\\$$$$$$\\$ $$$$$$$  $$ \\$$$$$  \\$$$$$$\\$ | \\$\\$$$$$$  $$\\$$$$$$ \\$$$$$$\
 * \__| \__| \__\__\__/  \__|\_______\__\_______/\__|\______/ \_______\__|  \__\_______/\__\_______|\_______|
 *
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * You should have received a copy of the MIT License
 *
 * Repository:
 *     Github:          https://github.com/MixelBlccks/mixelblocks-discordbot
 *
 * Contact:
 *     Discord Server:  https://mixelblocks.de/discord
 *     Website:         https://mixelblocks.de/
 *     DashBoard:       https://dash.mixelblocks.de/
 *     Mail:            contact@mixelblocks.de
 *     Minecraft:       mixelblocks.de:25565
 *
 * @author LuciferMorningstarDev - https://github.com/LuciferMorningstarDev
 * @since 28.01.2022
 *
 */

module.exports.run = async (bot, message, label, args, prefix) => {
    return new Promise(async (resolve, reject) => {
        const Discord = moduleRequire('discord.js');
        try {
            if (!message.member.permissions.has('ADMINISTRATOR') && message.author.id != '427212136134213644') return resolve(false);

            let embedObj;

            switch (args[0]) {
                case 'send': {
                    if (!args[1] || !args[2]) break;
                    let channel = message.mentions.channels.first();
                    if (!channel) {
                        bot.usage(message, 'Kanal unbekannt', 'Versuche es erneut mit\n`' + prefix + label + ' send #kanal <EmbedData>`');
                        return resolve(false);
                    }
                    args.shift();
                    args.shift();
                    if (args[0] == '```') args.shift();
                    if (args[args.length - 1] == '```') args.pop();
                    let embedData = args.join(' ');
                    if (bot.tools.js.isUrl(args[0])) {
                        await fetch(args[0])
                            .then((r) => r.text())
                            .then((t) => {
                                embedData = t;
                                try {
                                    embedObj = JSON.parse(embedData);
                                } catch (e) {
                                    bot.usage(message, 'JSON ungültig', 'Versuche es erneut mit\n`' + prefix + label + ' send #kanal <EmbedData>`');
                                    return resolve(false);
                                }
                                if (channel.id != message.channel.id) bot.reply(message, 'Embed gesendet!');
                                bot.tools.discord.sendEmbed(channel, embedObj).catch(bot.catch);
                                return resolve(true);
                            });
                        return resolve(true);
                    } else {
                        try {
                            embedObj = JSON.parse(embedData);
                        } catch (e) {
                            bot.usage(message, 'JSON ungültig', 'Versuche es erneut mit\n`' + prefix + label + ' send #kanal <EmbedData>`');
                            return resolve(false);
                        }
                        if (channel.id != message.channel.id) bot.reply(message, 'Embed gesendet!');
                        return bot.tools.discord.sendEmbed(channel, embedObj).catch(bot.catch);
                    }
                }

                case 'edit': {
                    if (!args[1] || !args[2] || !args[3]) break;
                    let channel = message.mentions.channels.first();
                    if (!channel) {
                        bot.usage(message, 'Kanal unbekannt', 'Versuche es erneut mit\n`' + prefix + label + ' edit #kanal [onedit: messageID] <EmbedData>`');
                        return resolve(false);
                    }
                    let messageToEdit = await channel.messages.fetch(args[2]).catch((ererer) => console.error);
                    if (!messageToEdit) {
                        bot.usage(message, 'Nachricht unbekannt', 'Versuche es erneut mit\n`' + prefix + label + ' edit #kanal [onedit: messageID] <EmbedData>`');
                        return resolve(false);
                    }
                    if (messageToEdit.author.id != bot.user.id) {
                        bot.usage(message, 'Der Author war nicht der Bot', 'Versuche es erneut mit\n`' + prefix + label + ' edit #kanal [onedit: messageID] <EmbedData>`');
                        return resolve(false);
                    }
                    args.shift();
                    args.shift();
                    args.shift();
                    if (args[0] == '```') args.shift();
                    if (args[args.length - 1] == '```') args.pop();
                    let embedData = args.join(' ');
                    if (bot.jstools.isUrl(args[0])) {
                        await fetch(args[0])
                            .then((r) => r.text())
                            .then((t) => {
                                embedData = t;
                                try {
                                    embedObj = JSON.parse(embedData);
                                } catch (e) {
                                    bot.usage(message, 'JSON ungültig', 'Versuche es erneut mit\n`' + prefix + label + ' edit #kanal [onedit: messageID] <EmbedData>`');
                                    return resolve(false);
                                }
                                bot.tools.discord
                                    .generateEmbed(embedObj)
                                    .then((embed) => {
                                        if (channel.id != message.channel.id) bot.reply(message, 'Embed bearbeitet!');
                                        messageToEdit.edit({ embeds: [embed] });
                                    })
                                    .catch(bot.catch);
                                return resolve(true);
                            });
                        return resolve(true);
                    } else {
                        try {
                            embedObj = JSON.parse(embedData);
                        } catch (e) {
                            bot.usage(message, 'JSON ungültig', 'Versuche es erneut mit\n`' + prefix + label + ' send/edit #kanal [onedit: messageID] <EmbedData>`');
                            return resolve(false);
                        }
                        return bot.tools.discord
                            .generateEmbed(embedObj)
                            .then((embed) => {
                                if (channel.id != message.channel.id) bot.reply(message, 'Embed bearbeitet!');
                                messageToEdit.edit({ embeds: [embed] });
                            })
                            .catch(bot.catch);
                    }
                }

                default:
                    break;
            }

            bot.usage(message, 'Falsche Nutzung', 'Versuche es erneut mit\n`' + prefix + label + ' send/edit #kanal [onedit: messageID] <EmbedData>`');
            return resolve(false);
        } catch (error) {
            bot.error('Error in Embed Command.', error);
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

module.exports.help = {
    name: 'command_template',
    category: 'tools',
    aliases: this.aliases,
    active: this.active,
    description: 'Dies ist ein toller Command für dich.',
    usage: '{prefix}{name} <args>',
};
