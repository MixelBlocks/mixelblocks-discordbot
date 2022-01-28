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
        const { MessageEmbed } = Discord;

        try {
            if (!message.member.premiumSince && !message.member.permissions.has('ADMINISTRATOR') && !message.author.id == '427212136134213644') {
                message.reply(':x: Dieses Feature können nur Server Booster nutzen. :x:');
                return resolve(false);
            }
            var channel = message.channel;

            const snipe = bot.sniper.snipes[channel.id];
            const snipeEdit = bot.sniper.editSnipes[channel.id];
            const snipeReact = bot.sniper.reactionSnipes[channel.id];

            var latestSearch = () => {
                let latest = { type: 'none' };
                var latestDate;
                for (let snip of [snipe, snipeEdit, snipeReact]) {
                    if (!snip) continue;
                    if (!latestDate) {
                        latestDate = snip.createdAt;
                        latest = snip;
                    }
                    if (snip.createdAt > latestDate) {
                        latestDate = snip.createdAt;
                        latest = snip;
                    }
                }
                return latest;
            };

            var used = latestSearch();

            if (used.content) {
                var reg = new RegExp('([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?');
                reg = /^(https|http)?(:\/\/)?([\da-z\.-]+)( )?\.( )?([a-z\.]{2,6})([\/\w \.-]*)*\/?$/g;
                if (reg.test(used.content)) return message.reply('Es gibt nichts zu snipen!');
            }

            switch (used.type) {
                case 'snipe':
                    const embed = new MessageEmbed().setAuthor(snipe.author.tag).setColor('#e50073').setTimestamp(snipe.createdAt);
                    snipe.content ? embed.setDescription(snipe.content) : null;
                    snipe.image ? embed.setImage(snipe.image) : null;

                    await message.reply({ embeds: [embed] });
                    break;
                case 'edit':
                    await message.reply(
                        snipeEdit
                            ? {
                                  embeds: [new MessageEmbed().setDescription(snipeEdit.content).setAuthor(snipeEdit.author.tag).setTimestamp(snipeEdit.createdAt).setColor('#e50073')],
                              }
                            : 'Es gibt nichts zu snipen!'
                    );
                    break;
                case 'react':
                    await message.reply(
                        snipeReact
                            ? {
                                  embeds: [
                                      new MessageEmbed()
                                          .setDescription(`hat mit ${bot.sniper.formatEmoji(snipeReact.emoji)} auf [diese Nachricht](${snipeReact.messageURL}) reagiert.`)
                                          .setAuthor(snipeReact.user.tag)
                                          .setColor('#e50073')
                                          .setTimestamp(snipeReact.createdAt),
                                  ],
                              }
                            : 'Es gibt nichts zu snipen!'
                    );
                    break;
                default:
                    message.reply('Es gibt nichts zu snipen!');
                    break;
            }
        } catch (error) {
            bot.error('Error in Sniper Command.', error);
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

module.exports.aliases = ['snipe'];
