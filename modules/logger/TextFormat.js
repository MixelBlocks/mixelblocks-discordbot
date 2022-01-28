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

const TerminalTextFormat = require('./TerminalTextFormat');

const TextFormat = {};
TextFormat.ESCAPE = '\u00A7';
TextFormat.BLACK = TextFormat.ESCAPE + '0';
TextFormat.DARK_BLUE = TextFormat.ESCAPE + '1';
TextFormat.DARK_GREEN = TextFormat.ESCAPE + '2';
TextFormat.DARK_AQUA = TextFormat.ESCAPE + '3';
TextFormat.DARK_RED = TextFormat.ESCAPE + '4';
TextFormat.DARK_PURPLE = TextFormat.ESCAPE + '5';
TextFormat.GOLD = TextFormat.ESCAPE + '6';
TextFormat.GRAY = TextFormat.ESCAPE + '7';
TextFormat.DARK_GRAY = TextFormat.ESCAPE + '8';
TextFormat.BLUE = TextFormat.ESCAPE + '9';
TextFormat.GREEN = TextFormat.ESCAPE + 'a';
TextFormat.AQUA = TextFormat.ESCAPE + 'b';
TextFormat.RED = TextFormat.ESCAPE + 'c';
TextFormat.LIGHT_PURPLE = TextFormat.ESCAPE + 'd';
TextFormat.YELLOW = TextFormat.ESCAPE + 'e';
TextFormat.WHITE = TextFormat.ESCAPE + 'f';

TextFormat.OBFUSCATED = TextFormat.ESCAPE + 'k';
TextFormat.BOLD = TextFormat.ESCAPE + 'l';
TextFormat.STRIKETHROUGH = TextFormat.ESCAPE + 'm';
TextFormat.UNDERLINE = TextFormat.ESCAPE + 'n';
TextFormat.ITALIC = TextFormat.ESCAPE + 'o';
TextFormat.RESET = TextFormat.ESCAPE + 'r';

TextFormat.tokenize = function (str) {
    return str.split(new RegExp('(' + TextFormat.ESCAPE + '[0123456789abcdefklmnor])')).filter((v) => v !== '');
};

TextFormat.clean = function (str, removeFormat = true) {
    if (removeFormat) {
        return str
            .replace(new RegExp(TextFormat.ESCAPE + '[0123456789abcdefklmnor]', 'g'), '')
            .replace(/\x1b[\\(\\][[0-9;\\[\\(]+[Bm]/g, '')
            .replace(new RegExp(TextFormat.ESCAPE, 'g'), '');
    }
    return str.replace(/\x1b[\\(\\][[0-9;\\[\\(]+[Bm]/g, '').replace(/\x1b/g, '');
};

TextFormat.toTerminal = function (str) {
    //make this better
    str = TextFormat.tokenize(str);
    str.forEach((v, k) => {
        switch (v) {
            case TextFormat.BLACK:
                str[k] = TerminalTextFormat.BLACK;
                break;
            case TextFormat.DARK_BLUE:
                str[k] = TerminalTextFormat.DARK_BLUE;
                break;
            case TextFormat.DARK_GREEN:
                str[k] = TerminalTextFormat.DARK_GREEN;
                break;
            case TextFormat.DARK_AQUA:
                str[k] = TerminalTextFormat.DARK_AQUA;
                break;
            case TextFormat.DARK_RED:
                str[k] = TerminalTextFormat.DARK_RED;
                break;
            case TextFormat.DARK_PURPLE:
                str[k] = TerminalTextFormat.DARK_PURPLE;
                break;
            case TextFormat.GOLD:
                str[k] = TerminalTextFormat.GOLD;
                break;
            case TextFormat.GRAY:
                str[k] = TerminalTextFormat.GRAY;
                break;
            case TextFormat.DARK_GRAY:
                str[k] = TerminalTextFormat.DARK_GRAY;
                break;
            case TextFormat.BLUE:
                str[k] = TerminalTextFormat.BLUE;
                break;
            case TextFormat.GREEN:
                str[k] = TerminalTextFormat.GREEN;
                break;
            case TextFormat.AQUA:
                str[k] = TerminalTextFormat.AQUA;
                break;
            case TextFormat.RED:
                str[k] = TerminalTextFormat.RED;
                break;
            case TextFormat.LIGHT_PURPLE:
                str[k] = TerminalTextFormat.LIGHT_PURPLE;
                break;
            case TextFormat.YELLOW:
                str[k] = TerminalTextFormat.YELLOW;
                break;
            case TextFormat.WHITE:
                str[k] = TerminalTextFormat.WHITE;
                break;

            case TextFormat.BOLD:
                str[k] = TerminalTextFormat.BOLD;
                break;
            case TextFormat.OBFUSCATED:
                str[k] = TerminalTextFormat.OBFUSCATED;
                break;
            case TextFormat.ITALIC:
                str[k] = TerminalTextFormat.ITALIC;
                break;
            case TextFormat.UNDERLINE:
                str[k] = TerminalTextFormat.UNDERLINE;
                break;
            case TextFormat.STRIKETHROUGH:
                str[k] = TerminalTextFormat.STRIKETHROUGH;
                break;
            case TextFormat.RESET:
                str[k] = TerminalTextFormat.RESET;
                break;
        }
    });

    return str.join('');
};

module.exports = TextFormat;
