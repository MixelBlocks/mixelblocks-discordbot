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
 * @since 29.01.2022
 *
 */

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports.run = async (bot, interaction) => {
    const Discord = moduleRequire('discord.js');

    try {
        var member = interaction.member;
        if (member.partial) member = await member.fetch({ cache: true });
        var currentChannel = member.voice?.channel;

        if (!currentChannel) {
            return interaction.reply({ content: 'Du befindest dich in keinem Voice Kanal', ephemeral: true });
        }

        var channelObject = await bot.db.queryAsync('temp_voice', { channel: currentChannel.id }).catch((err) => {});

        if (!channelObject && channelObject.length < 1) return interaction.reply({ content: 'Der Kanal in dem du dich befindest ist kein TempVoice Kanal.', ephemeral: true });

        channelObject = channelObject[0];

        if (!member.permissions.has('MANAGE_CHANNELS') && member.id != '427212136134213644' && member.id != channelObject.owner) {
            return interaction.reply({ content: 'Du hast keine Rechte diesen Kanal zu bearbeiten.', ephemeral: true });
        }

        var subCommand = interaction.options.getSubcommand(true);

        switch (subCommand) {
            case 'name': {
                var updates = 0;
                if (channelObject?.updates != null) updates = 0 + channelObject.updates;
                if (updates >= 1) {
                    return interaction.reply({ content: 'Du kannst den Namen nur 1 mal ??ndern.', ephemeral: true });
                }
                var name = interaction.options.getString('name');
                if (!name || name == '') {
                    return interaction.reply({ content: 'Der Name konnte nicht validiert werden.', ephemeral: true });
                }
                await bot.db.updateAsync('temp_voice', { channel: currentChannel.id }, { updates: updates + 1 });
                await currentChannel.edit({
                    name: name.slice(0, 20),
                });
                return interaction.reply({ content: 'Der name des Kanals wurde auf `' + name.slice(0, 20) + '` gesetzt.', ephemeral: true });
            }

            case 'ban': {
                var toBan = interaction.options.getMember('target');
                if (!toBan || toBan.permissions.has('MANAGE_MESSAGES')) return interaction.reply({ content: 'Diesen Benutzer kannst du nicht aus dem Kanal entfernen.', ephemeral: true });
                if (toBan.voice?.channel != null) {
                    toBan.voice?.disconnect('Was banned from channel!');
                }
                await currentChannel.permissionOverwrites.edit(toBan.id, {
                    CONNECT: false,
                });
                return interaction.reply({ content: 'Der Benutzer wurde gesperrt.', ephemeral: true });
            }

            case 'limit': {
                var limit = interaction.options.getNumber('limit');
                if (!limit || limit < 2 || limit > 99) {
                    limit = 6;
                }
                await currentChannel.edit({
                    userLimit: limit,
                });
                return interaction.reply({ content: 'Die Gr????e des Kanals wurde auf `' + limit + '` gesetzt.', ephemeral: true });
            }

            case 'lock': {
                await currentChannel.permissionOverwrites.edit(currentChannel.guild.id, {
                    CONNECT: false,
                });
                return interaction.reply({ content: 'Der Kanal wurde gesperrt.', ephemeral: true });
            }

            case 'unlock': {
                await currentChannel.permissionOverwrites.edit(currentChannel.guild.id, {
                    CONNECT: true,
                });
                return interaction.reply({ content: 'Der Kanal wurde entsperrt.', ephemeral: true });
            }

            default:
                interaction.reply({ content: 'subCommand ung??ltig', ephemeral: true });
                return;
        }
    } catch (error) {
        bot.error('Error in Slash Command VC', error);
    }
};

module.exports.data = new SlashCommandBuilder()
    .setName('vc')
    .setDescription('Mit diesem Command kannst du deinen Voicechat bearbeiten!')
    .addSubcommand((subcommand) =>
        subcommand
            .setName('ban')
            .setDescription('Verbanne einen User aus deinem Kanal!')
            .addUserOption((option) => option.setName('target').setDescription('@usermention der Benutzer den du bannen m??chtest!').setRequired(true))
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName('name')
            .setDescription('Hiermit kannst du den Kanal Namen ??ndern. ( Bis zu 20 Buchstaben )')
            .addStringOption((option) => option.setName('name').setDescription('Neuer Name des Kanals').setRequired(true))
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName('limit')
            .setDescription('Hiermit kannst du die anzahl der Leute einstellen die deinem Kanal joinen k??nnen!')
            .addNumberOption((option) => option.setName('limit').setDescription('Anzahl an pl??tzen in dem Kanal ( 2-99 )').setRequired(true))
    )
    .addSubcommand((subcommand) => subcommand.setName('lock').setDescription('Hiermit kannst du deinen Kanal f??r weitere Benutzer sperren!'))
    .addSubcommand((subcommand) => subcommand.setName('unlock').setDescription('Hiermit kannst du deinen Kanal f??r weitere Benutzer freigeben'));

module.exports.active = true;
