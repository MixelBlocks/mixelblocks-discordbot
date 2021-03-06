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

const ts = moduleRequire('time-stamp');
const Discord = moduleRequire('discord.js');

const { Routes } = moduleRequire('discord-api-types/v9');

module.exports = async (bot) => {
    // Fetch some channels and the main guild
    await bot.guilds.fetch(bot.configs.general.guild_id).then(async (guild) => {
        bot.logChannel = await guild.channels.fetch(bot.configs.general.channels.bot_log).catch(bot.catch);
        bot.errorChannel = await guild.channels.fetch(bot.configs.general.channels.error_log).catch(bot.catch);
        // TODO: add ids to configs
        await guild.channels.fetch('938800709535678504').then(async (channel) => {
            bot.ticketMessage = await channel.messages.fetch('938804408278483004');
            var components = [new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setLabel('Ticket Erstellen').setStyle('DANGER').setEmoji('????').setCustomId('create_new_ticket'))];
            if (!bot.ticketMessage.components || bot.ticketMessage.components.length < 1) {
                bot.ticketMessage.edit({
                    embeds: bot.ticketMessage.embeds,
                    components: components,
                });
            }
        });
    });

    // update random status
    bot.tools.discord.updateStatus(bot);
    setInterval(() => {
        bot.tools.discord.updateStatus(bot);
    }, 120000);

    // start api when everything is loaded
    var webserver = require('../api');
    webserver.listen(bot, process.env.API_PORT);

    if (Date.now() - bot.restartCommandUsed?.when < 5000) {
        var restartedChannel = bot.restartCommandUsed?.channel;
        bot.channels.fetch(restartedChannel).then((ch) => {
            bot.send({ channel: ch }, '[RESTART SUCCESSFUL] ?? Bot logged in successful without problems ??');
        });
    }

    (async () => {
        try {
            bot.logger.log('Started refreshing application (/) commands.');
            var slashCommands = [];
            for (let slash_command of bot.slash_commands.array()) slashCommands.push(slash_command.data.toJSON());
            await bot.restClient.put(Routes.applicationGuildCommands(bot.user.id, bot.configs.general.guild_id), { body: slashCommands });
            bot.logger.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            bot.logger.error(error);
        }
    })();

    bot.logger.log('[LOGIN SUCCESSFUL] ?? Bot logged in successful without problems ??');
};
