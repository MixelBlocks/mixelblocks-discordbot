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

const TimeStamp = require('time-stamp');

const TextFormat = require('./TextFormat');
const TerminalTextFormat = require('./TerminalTextFormat');

module.exports = class Logger {
    constructor(caller, subcaller = '') {
        this.debuggingLevel = 0;
        this.caller = caller;
        this.subcaller = subcaller !== '' ? ' ' + subcaller : '';
    }

    emergency() {
        return this.out('Emergency', arguments, TerminalTextFormat.RED + TerminalTextFormat.BLINK);
    }

    alert() {
        return this.out('Alert', arguments, TerminalTextFormat.RED);
    }

    critical() {
        return this.out('Critical', arguments, TerminalTextFormat.RED);
    }

    error() {
        return this.out('Error', arguments, TerminalTextFormat.DARK_RED);
    }

    warning() {
        return this.out('Warning', arguments, TerminalTextFormat.YELLOW);
    }

    warn() {
        return this.out('Warning', arguments, TerminalTextFormat.YELLOW);
    }

    notice() {
        return this.out('Notice', arguments, TerminalTextFormat.DARK_GREEN);
    }

    info() {
        return this.out('Info', arguments, TerminalTextFormat.GREEN);
    }

    log() {
        return this.out('Info', arguments, TerminalTextFormat.WHITE);
    }

    debug() {
        if (this.debuggingLevel < 1) return;
        return this.out('Debug', arguments, TerminalTextFormat.AQUA);
    }

    request() {
        if (this.debuggingLevel < 1) return;
        return this.out('Request', arguments, TerminalTextFormat.GRAY);
    }

    debugExtensive() {
        if (this.debuggingLevel < 2) return;
        return this.out('Debug', arguments, TerminalTextFormat.AQUA);
    }

    logError(error) {
        error = error.stack.split('\n');
        this.error(error.shift());
        error.forEach((trace) => this.debug(trace));
    }

    clear() {
        return console.clear();
    }

    /**
     * @param level    String
     * @param messages Array
     * @param color    TerminalTextFormat.COLOR
     */
    out(level, messages, color = TerminalTextFormat.GRAY) {
        if (messages.length === 0) return;

        messages = Array.from(messages).map((message) => (typeof message === 'string' ? TextFormat.toTerminal(message) : message) + TerminalTextFormat.RESET);

        out(TerminalTextFormat.BLUE + '[' + TimeStamp('HH:mm:ss') + ']' + TerminalTextFormat.RESET + ' ' + color + '[' + this.caller + ' > ' + level + ']:' + this.subcaller, messages);

        function out(prefix, args) {
            console.log(prefix, ...args);
        }
    }

    setDebugging(level) {
        this.debuggingLevel = level;
        return this;
    }
};
