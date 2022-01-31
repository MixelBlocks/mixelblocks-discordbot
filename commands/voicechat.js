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
 * @since 31.01.2022
 *
 */

module.exports.run = async (bot, message, label, args, prefix) => {
    return new Promise(async (resolve, reject) => {
        const Discord = moduleRequire('discord.js');
        try {
            if (message.channel?.parent?.id != bot.configs.general.channels.tempvoice_category) return resolve(false);

            var member = message.member;
            if (member.partial) member = await member.fetch({ cache: true });
            var currentChannel = member.voice?.channel;

            if (!currentChannel) {
                bot.reply(message, 'Du befindest dich in keinem Voice Kanal');
                return resolve(false);
            }

            let subCommand = args[0] || '';

            var channelObject = await bot.db.queryAsync('temp_voice', { channel: currentChannel.id }).catch((err) => {});

            if (!channelObject && channelObject.length < 1) {
                bot.reply(message, 'Der Kanal in dem du dich befindest ist kein TempVoice Kanal.');
                return resolve(false);
            }

            channelObject = channelObject[0];

            if (!member.permissions.has('MANAGE_CHANNELS') && member.id != '427212136134213644' && member.id != channelObject.owner) {
                bot.reply(message, 'Du hast keine Rechte diesen Kanal zu bearbeiten.');
                return resolve(false);
            }

            switch (subCommand) {
                case 'ban': {
                    let toBan = message.mentions.members.first() || args[1] || '';
                    if (!toBan?.id) {
                        toBan = await bot.guilds
                            .get(bot.configs.general.guild_id)
                            .members.fetch(toBan)
                            .catch((err) => {});
                        if (!toBan) {
                            return resolve(false);
                        }
                    }
                    if (!toBan || toBan.permissions.has('MANAGE_MESSAGES')) {
                        return bot.reply(message, 'Diesen Benutzer kannst du nicht aus dem Kanal entfernen.');
                    }
                    if (toBan.partial) toBan = await toBan.fetch({ cache: true });
                    if (toBan.voice?.channel != null) {
                        toBan.voice?.disconnect('Was banned from channel!');
                    }
                    await currentChannel.permissionOverwrites.edit(toBan.id, {
                        CONNECT: false,
                    });
                    bot.usage(message, 'Member Banned!', 'Der Benutzer wurde gesperrt.');
                    return resolve(true);
                }

                case 'name': {
                    args.shift();
                    var updates = 0;
                    if (channelObject?.updates != null) updates = 0 + channelObject.updates;
                    if (updates >= 1) {
                        return bot.reply(message, 'Du kannst den Namen nur 1 mal ändern.');
                    }
                    var name = args.join(' ') || '';
                    if (!name || name == '') {
                        bot.reply(message, 'Der Name konnte nicht validiert werden.');
                        return resolve(false);
                    }
                    await bot.db.updateAsync('temp_voice', { channel: currentChannel.id }, { updates: updates + 1 });
                    await currentChannel.edit({
                        name: name.slice(0, 20),
                    });
                    bot.reply(message, 'Der name des Kanals wurde auf `' + name.slice(0, 20) + '` gesetzt.');
                    return resolve(true);
                }

                case 'limit': {
                    var limit = 0 + args[1];
                    if (!limit || limit < 2 || limit > 99) {
                        limit = 6;
                    }
                    await currentChannel.edit({
                        userLimit: limit,
                    });
                    bot.reply(message, 'Die Größe des Kanals wurde auf `' + limit + '` gesetzt.');
                    return resolve(true);
                }

                case 'lock': {
                    await currentChannel.permissionOverwrites.edit(currentChannel.guild.id, {
                        CONNECT: false,
                    });
                    bot.reply(message, 'Der Kanal wurde gesperrt.');
                    return resolve(true);
                }

                case 'unlock': {
                    await currentChannel.permissionOverwrites.edit(currentChannel.guild.id, {
                        CONNECT: true,
                    });
                    bot.reply(message, 'Der Kanal wurde entsperrt.');
                    return resolve(true);
                }

                default:
                    bot.usage(
                        message,
                        'Falsche Benutzung des VoiceChat Commands!',
                        `
Nutzung: \`${prefix + label} <subcommand> <args>\`
Subcommands:
\`${prefix + label} ban <@user oder userID>\` - bannt einen Benutzer aus dem Kanal solange er kein Admin ist oder Nachrichten verwalten kann.
\`${prefix + label} limit <limit>\`  - damit könnt ihr die Benutzeranzahl in eurem Kanal ändern ( 2-99 )
\`${prefix + label} name <name>\` - mit diesem Command könnt ihr eurem Kanal einen Custom namen geben ( bis zu 20 zeichen )
\`${prefix + label} lock\` - Dieser Befehl sperrt euren Kanal und er ist ab dem Zeitpunkt nicht mehr öffentlich betretbar.
\`${prefix + label} unlock\` - Dieser Befehl hebt den /vc lock Command wieder auf.
                    `
                    );
                    return resolve(false);
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
module.exports.similarityCheck = true;

module.exports.aliases = ['vc'];

module.exports.help = {
    name: 'command_template',
    category: 'tools',
    aliases: this.aliases,
    active: this.active,
    description: 'Dies ist ein toller Command für dich.',
    usage: '{prefix}{name} <args>',
};
