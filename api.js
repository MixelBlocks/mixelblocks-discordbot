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

module.exports = () => null;

module.exports.listen = async (bot, port) => {
    var express = moduleRequire('express');
    var ejs = moduleRequire('ejs');

    var rateLimit = moduleRequire('express-rate-limit');
    var compression = moduleRequire('compression');
    var cookieParser = moduleRequire('cookie-parser');

    var favicon = moduleRequire('serve-favicon');

    var fs = moduleRequire('fs');
    var path = moduleRequire('path');

    var createRateLimit = (ms, max) => {
        return rateLimit({
            windowMs: ms,
            max: max,
            message: JSON.stringify(
                {
                    error: true,
                    message: `You reached the ratelimit of ${max} requests per Time ${msToTime(ms)}`,
                    hits: max,
                    time: ms,
                },
                null,
                4
            ),
            skip: function (req, res) {
                try {
                    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                    if ((ip = '::1')) ip = '127.0.0.1';
                    var addr = ip6addr.parse(ip).toString({
                        format: 'v4',
                    });
                    if (!addr || addr.includes('127.0.0.1') || addr.includes('localhost')) {
                        return true;
                    }
                } catch (err) {}
                return false;
            },
        });
    };

    const defPath = process.cwd().endsWith('/') ? process.cwd() + 'htdocs/' : process.cwd() + '/' + 'htdocs/';
    const viewsPath = defPath + 'views/';
    const publicPath = defPath + 'public/';

    const app = express();

    app.use(compression());
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.set('json spaces', 4);
    app.set('views', viewsPath);
    app.set('view engine', 'ejs');

    app.use('/static', express.static(publicPath));

    app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

    app.use(function (req, res, next) {
        res.removeHeader('X-Powered-By');
        next();
    });

    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    app.get('*', async (req, res, next) => {
        return res.status(404).json({
            error: true,
            message: 'That endpoint does not exist.',
        });
    });

    app.listen(port, () => {
        bot.logger.debug('HTTP BOTAPI Server running on Port ' + port);
    });

    return (bot.apiServer = app);
};
