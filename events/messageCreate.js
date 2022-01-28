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
const {
    MessageMentions: { USERS_PATTERN },
} = Discord;

var commandLastPost = {};
var messageTriple = {};

module.exports = async (bot, message) => {
    // dont react to bots and dms
    if (message.author.bot) return;
    if (message.channel.type == 'dm') return;

    // dont react to empty messages
    if (!message.content) return;

    // repeat last 3 messages id authors different and the text to lowercase is the same :D
    if (!messageTriple[message.channel.id] || messageTriple[message.channel.id].content.toLowerCase() != message.content.toLowerCase()) {
        messageTriple[message.channel.id] = { content: message.content, authors: [message.author.id] };
    }
    if (!messageTriple[message.channel.id].authors.includes(message.author.id)) messageTriple[message.channel.id].authors.push(message.author.id);
    if (messageTriple[message.channel.id].authors.length >= 3) {
        message.channel.send(message.content);
        messageTriple[message.channel.id] = { content: '', authors: [] };
    }

    var prefix = bot.configs.general.default_prefix;
    var prefixes = bot.configs.general.other_prefixes;

    // detect if an optional prefix was used
    for (let p of prefixes) {
        if (message.content.startsWith(p)) {
            prefix = p;
            break;
        }
    }

    // send prefix at just mention
    if (message.content == `<@!${bot.user.id}>`) {
        message.reply('Mein Prefix ist `' + prefix + '`');
        return;
    }

    // make commands run with mention too
    if (message.content.startsWith(`<@!${bot.user.id}>`)) {
        prefix = `<@!${bot.user.id}>`;
    }

    // ignore messages without prefix at the beginning
    if (message.content.indexOf(prefix) !== 0) return;

    // argument declaration
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // grab command of the command nap
    var cmd = bot.commands.get(command);

    // check if a similar command is available
    if (!cmd) {
        try {
            cmd = bot.commands.get(bot.tools.discord.getSimilarCommand(bot, command) || '');
        } catch (error) {
            bot.error(error);
        }
    }

    // do nothing if command doesnt exist
    if (!cmd) return;

    // anti commandspam
    var ts = Date.now();
    if (commandLastPost[message.author.id] != null) {
        if (ts - commandLastPost[message.author.id] < 3000) {
            if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.reply(':x: Bitte kein Command Spam! :x:');
        }
    }
    commandLastPost[message.author.id] = ts;

    // finally run the command
    try {
        var commandResult = await cmd.run(bot, message, command, args, prefix);
        if (commandResult) message.react('✅').catch((err) => {});
        else message.react(':x:').catch((err) => {});
    } catch (error) {
        message.react(':x:').catch((err) => {});
    }
    return;
};
