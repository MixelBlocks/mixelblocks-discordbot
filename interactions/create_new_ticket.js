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
 * @since 03.02.2022
 *
 */

const { Snowflake } = moduleRequire('nodejs-snowflake');

// TODO: add ids to configs
const openedID = '938800588077015071'; // ID of category for opened tickets
const closedID = '938800632570187796'; // ID of category for closed tickets

module.exports.run = async (bot, interaction) => {
    const Discord = moduleRequire('discord.js');

    try {
        if (interaction.member.id != '427212136134213644') return interaction.reply({ content: 'Dieses Feature ist noch nicht implementiert.', ephemeral: true });

        var categoryOpened = await bot.channels.fetch(openedID);
        var categoryClosed = await bot.channels.fetch(closedID);

        if (!categoryOpened || !categoryClosed) return interaction.reply({ content: 'Die Einrichtung des Ticketsystems ist nicht abgeschlossen.', ephemeral: true });

        if (categoryOpened.children.size >= 50) return interaction.reply({ content: 'Aktuell sind zuviele Tickets geöffnet. Bitte versuche es später erneut.', ephemeral: true });

        const uid = new Snowflake();
        var newTicketID = uid.getUniqueID();

        var newTicketChannel = await interaction.guild.channels.create('open-' + newTicketID, {
            reason: 'Ticket opened',
            type: 'GUILD_TEXT',
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                },
                {
                    id: interaction.member.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                },
                {
                    id: '938822964634325002', // TODO: config ticket supporter role entry
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                },
            ],
        });

        await newTicketChannel.setParent(openedID);

        var dbEntryDate = Date.now();
        await bot.db.insertAsync('tickets', {
            id: '' + newTicketID,
            creator: interaction.member.id,
            channel: newTicketChannel.id,
            createdAt: dbEntryDate,
            messages: [{ at: dbEntryDate, user: 'system', content: 'Created...' }],
        });

        var embed = await bot.tools.discord.generateEmbed({
            title: 'Hier ist dein neues Ticket!',
            color: 'RED',
            description: `
Bitte beschreibe uns ausführlich dein Anliegen und bitte uns stelle keine MetaFragen. 

[Was ist eine MetaFrage?](http://metafrage.de/)
            `,
        });

        await newTicketChannel.send({
            content: '<@' + interaction.member.id + '>',
            embeds: [embed],
            components: [new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setLabel('Ticket schliessen').setStyle('DANGER').setEmoji('🎫').setCustomId('close_ticket'), new Discord.MessageButton().setLabel('Ticket löschen').setStyle('DANGER').setEmoji('🎫').setCustomId('delete_ticket')])],
        });

        interaction.reply({ content: 'Dein Ticket wurde erstellt. <#' + newTicketChannel.id + '>', ephemeral: true });
    } catch (error) {
        console.error(error);
        bot.error('Error in Interaction Command create_new_ticket', error);
    }
};

module.exports.active = true;
