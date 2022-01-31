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

const Discord = moduleRequire('discord.js');
const uuidv4 = moduleRequire('uuid').v4;

module.exports = async (bot, member) => {
    if (member.guild.id != bot.configs.general.guild_id) return;
    try {
        if (member.partial) member = await member.fetch();
    } catch (error) {
        bot.catch(error);
    }

    var index = Math.floor(Math.random() * bot.configs.welcome.messages.length);
    if (index < 0) index = 0;
    if (index >= activities_list.length) index = bot.configs.welcome.messages.length - 1;

    let message = bot.configs.welcome.messages[index]
        .replace(/{user}/g, `<@${member.id}>`)
        .replace(/{username}/g, member.user.username)
        .replace(/{member_count}/g, member.guild.memberCount)
        .replace(/{server_name}/g, member.guild.name)
        .replace(/{rules_channel}/g, `<#914812681754652672>`);

    var embed = bot.tools.discord.generateEmbed({
        title: 'Jemand neues ist angekommen :)',
        description: message,
        color: '#00EE00',
    });
    member.guild.channels.fetch(bot.configs.welcome.channel).then((channel) => {
        channel.send('<@' + member.id + '>', { embeds: [embed] });
    });

    var trustScore = await bot.tools.discord.calculateTrustScore(bot, member);
    var trustScoreAsNumber = 0 + trustScore[0];

    bot.send({ channel: await bot.channels.fetch(bot.configs.general.channels.trust_log) }, `Der TrustScore von ${member.user.username} beträgt **${trustScore[0]} Punkte**.\n**Berechnung:**\n\`\`\`diff\n${trustScore[1].sort().join('\n')}\n\`\`\``);

    if (trustScoreAsNumber < 100) {
        var uuid = uuidv4();
        var url = `https://bot.mixelblocks.de/captcha/${uuid}`;

        bot.verifyIdentifiers[uuid] = {
            id: member.id,
            url: url,
            uuid: uuid,
        };
        bot.sendUsage(member.user, 'Du scheinst ein Bot zu sein!', `Vor der Nutzung unseres Servers musst du ein Captcha lösen!\n[**Klicke dafür Hier**](${url})`, (msg) => {
            if (!msg) {
                bot.channels.fetch(bot.configs.general.channels.welcome_channel).then((channel) => {
                    bot.sendUsage(channel, `Du scheinst ein Bot zu sein!`, `<@${member.id}> Bitte aktiviere deine DM's und gebe per DM den Command \`/captcha\` ein um dich zu verifizieren.`);
                });
            }
        });
    } else member.roles.add(bot.configs.general.verified_role);
};
