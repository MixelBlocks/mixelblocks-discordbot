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

module.exports = () => null;

module.exports.copyObject = (mainObject) => {
    let objectCopy = {};
    let key;
    for (key in mainObject) {
        objectCopy[key] = mainObject[key];
    }
    return objectCopy;
};

module.exports.isArray = (toCheckVar) => toCheckVar !== null && Array.isArray(toCheckVar);

/**
 * Check if a given string is an URL
 * @param {String} str
 */
module.exports.isUrl = (str) => {
    try {
        let url = new URL(str);
    } catch (err) {
        return false;
    }
    return true;
};

module.exports.isValidUrl = (str) => {
    var pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$',
        'i'
    ); // fragment locator
    return !!pattern.test(str);
};

/**
 * returns a new Random generated Color ( you can provide a min brightness from 0-255 )
 */
module.exports.randomColor = (brightness = 0) => {
    // return (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);
    function randomChannel(brightness) {
        var r = 255 - brightness;
        var n = 0 | (Math.random() * r + brightness);
        var s = n.toString(16);
        return s.length == 1 ? '0' + s : s;
    }
    return '#' + randomChannel(brightness) + randomChannel(brightness) + randomChannel(brightness);
};

module.exports.niceNumber = (number = 0) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(number);
};

function timePad(n, z = 2) {
    return n;
}

module.exports.msToTimeString = (milliseconds) => {
    var seconds = Math.floor(milliseconds / 1000),
        minutes = Math.floor(seconds / 60),
        hours = Math.floor(minutes / 60),
        days = Math.floor(hours / 24),
        months = Math.floor(days / 30),
        years = Math.floor(days / 365);
    seconds %= 60;
    minutes %= 60;
    hours %= 24;
    days %= 30;
    months %= 12;

    if (years > 0) return [timePad(years) + ' Jahre', timePad(months) + ' Monate', timePad(days) + ' Tage'];
    if (months > 0) return [timePad(months) + ' Monate', timePad(days) + ' Tage', timePad(hours) + ' Stunden'];
    if (days > 0) return [timePad(days) + ' Tage', timePad(hours) + ' Stunden', timePad(minutes) + ' Minuten'];
    if (hours > 0) return [timePad(hours) + ' Stunden', timePad(minutes) + ' Minuten', timePad(seconds) + ' Sekunden'];
    if (minutes > 0) return [timePad(minutes) + ' Minuten', timePad(seconds) + ' Sekunden'];
    if (seconds > 0) return [timePad(seconds) + ' Sekunden'];
};

module.exports.msToDays = (milliseconds) => {
    return milliseconds / 1000 / 60 / 60 / 24;
};

module.exports.randomMinMax = (min, max) => {
    if (min >= max) throw new Error('Max must be greater then min.');
    return Math.floor(Math.random() * (max - min + 1) + min);
};

module.exports.randomInterval = async (minDelay, maxDelay, intervalFunction) => {
    var getRandomNumberBetween = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    var runFunction = () => {
        intervalFunction();
        createRandomInterval();
    };

    var createRandomInterval = () => {
        setTimeout(runFunction, getRandomNumberBetween(minDelay, maxDelay));
    };

    return createRandomInterval();
};
