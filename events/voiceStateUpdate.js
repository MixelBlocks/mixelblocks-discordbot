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

// event when the botsession gets invalid
module.exports = async (bot, oldState, newState) => {
    if (oldState?.guild?.id == null || oldState?.guild?.id != bot.configs.general.guild_id) return;
    const Discord = moduleRequire['discord.js'];
    let selfMember = await oldState.guild.members.fetch(bot.user.id);
    if (!selfMember.permissions.has('MANAGE_CHANNELS')) return;
    var lobby = bot.configs.general.channels.tempvoice_lobby;
    var category = bot.configs.general.channels.tempvoice_category;
    if (newState.channel && newState.channel.parent) {
        if (newState.channel.id != lobby) return;
        if (newState.channel.parent.id != category) return;
        let channel = await newState.member.guild.channels.create('TMP: ' + newState.member.displayName, {
            type: 'GUILD_VOICE',
        });
        channel.setParent(category);
        channel.setUserLimit(6);
        newState.member.voice.setChannel(channel);
        bot.db.insertAsync('temp_voice', { channel: channel.id, owner: newState.member.id });
        return;
    }
    if (oldState.channel.parent.id != category) return;
    bot.channels.cache.get(category).children.forEach((channel) => {
        if (channel.type == 'GUILD_VOICE') {
            if (channel.id != lobby) {
                if (channel.members.size < 1) {
                    channel.delete('making room for new tempvoice channels');
                    bot.db.deleteAsync('temp_voice', { channel: channel.id });
                }
            }
        }
    });
};
