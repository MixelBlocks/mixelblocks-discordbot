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

const TerminalTextFormat = {};
TerminalTextFormat.ESCAPE = '\u001b';

TerminalTextFormat.BLINK = TerminalTextFormat.ESCAPE + '[5m';

TerminalTextFormat.BLACK = TerminalTextFormat.ESCAPE + '[30m';
TerminalTextFormat.DARK_BLUE = TerminalTextFormat.ESCAPE + '[34m';
TerminalTextFormat.DARK_GREEN = TerminalTextFormat.ESCAPE + '[32m';
TerminalTextFormat.DARK_AQUA = TerminalTextFormat.ESCAPE + '[36m';
TerminalTextFormat.DARK_RED = TerminalTextFormat.ESCAPE + '[31m';
TerminalTextFormat.DARK_PURPLE = TerminalTextFormat.ESCAPE + '[35m';
TerminalTextFormat.GOLD = TerminalTextFormat.ESCAPE + '[33m';
TerminalTextFormat.GRAY = TerminalTextFormat.ESCAPE + '[37m';
TerminalTextFormat.DARK_GRAY = TerminalTextFormat.ESCAPE + '[30;1m';
TerminalTextFormat.BLUE = TerminalTextFormat.ESCAPE + '[34;1m';
TerminalTextFormat.GREEN = TerminalTextFormat.ESCAPE + '[32;1m';
TerminalTextFormat.AQUA = TerminalTextFormat.ESCAPE + '[36;1m';
TerminalTextFormat.RED = TerminalTextFormat.ESCAPE + '[31;1m';
TerminalTextFormat.LIGHT_PURPLE = TerminalTextFormat.ESCAPE + '[35;1m';
TerminalTextFormat.YELLOW = TerminalTextFormat.ESCAPE + '[33;1m';
TerminalTextFormat.WHITE = TerminalTextFormat.ESCAPE + '[37;1m';

TerminalTextFormat.OBFUSCATED = TerminalTextFormat.ESCAPE + '[47m';
TerminalTextFormat.BOLD = TerminalTextFormat.ESCAPE + '[1m';
TerminalTextFormat.STRIKETHROUGH = TerminalTextFormat.ESCAPE + '[9m';
TerminalTextFormat.UNDERLINE = TerminalTextFormat.ESCAPE + '[4m';
TerminalTextFormat.ITALIC = TerminalTextFormat.ESCAPE + '[3m';
TerminalTextFormat.RESET = TerminalTextFormat.ESCAPE + '[0m';

module.exports = TerminalTextFormat;
