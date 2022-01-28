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

const MongoDatabaseHandler = require('./mongo-driver');

module.exports.setupDatabaseHandler = (bot) => {
    bot.db = {};

    var databaseHandler = new MongoDatabaseHandler(process.env.MONGO_CONNECTION);

    bot.db.query = async (collection, searchQuery, callback) => {
        databaseHandler.query(process.env.DATABASE_NAME, collection, searchQuery, callback);
    };

    bot.db.insert = async (collection, object, callback) => {
        databaseHandler.insertObject(process.env.DATABASE_NAME, collection, object, callback);
    };

    bot.db.update = async (collection, searchQuery, object, callback) => {
        databaseHandler.updateObject(process.env.DATABASE_NAME, collection, searchQuery, object, callback);
    };

    bot.db.delete = async (collection, searchQuery, callback) => {
        databaseHandler.deleteObject(process.env.DATABASE_NAME, collection, searchQuery, callback);
    };

    bot.db.queryAsync = async (collection, searchQuery) => databaseHandler.queryAsync(process.env.DATABASE_NAME, collection, searchQuery);

    bot.db.insertAsync = async (collection, object) => databaseHandler.insertObject(process.env.DATABASE_NAME, collection, object);

    bot.db.updateAsync = async (collection, searchQuery, object) => databaseHandler.updateObject(process.env.DATABASE_NAME, collection, searchQuery, object);

    bot.db.deleteAsync = async (collection, searchQuery) => databaseHandler.deleteObject(process.env.DATABASE_NAME, collection, searchQuery);
};
