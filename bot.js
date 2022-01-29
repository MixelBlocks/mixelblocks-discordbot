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

// append process.env variables by .env file
require('dotenv').config();
const fs = require('fs');

// import modules
const { Client, Intents, MessageEmbed } = require('discord.js');
const { REST } = require('@discordjs/rest');
const Enmap = require('enmap');

// create the Discord Client
const bot = new Client({
    intents: new Intents(32767),
    restRequestTimeout: 10000,
});

const cachePath = process.cwd() + '/cache.json';
if (!fs.existsSync(cachePath)) {
    fs.writeFileSync(cachePath, JSON.stringify({ verifyUsers: {} }));
}

// enable logging
const Logger = require('./modules/logger');
bot.logger = new Logger(process.env.BOT_NAME);
bot.logger.setDebugging(process.env.DEBUG_LEVEL);

bot.error = async (errorMessage, error) => {
    if (errorMessage instanceof Error) {
        error = errorMessage;
        bot.logger.logError(errorMessage);
        errorMessage = error.message;
    } else {
        error = new Error(errorMessage);
        bot.logger.error(errorMessage);
        if (error) bot.logger.logError(error);
    }
};

bot.catch = async (error, channel) => {
    bot.error(error);
    if (channel) {
    }
};

bot.send = async (message, text, callback = () => {}) => {
    let replyEmbed = new MessageEmbed();
    replyEmbed.setDescription(text);
    replyEmbed.setColor('#226EB3');
    callback(await message.channel.send({ embeds: [replyEmbed] }).catch((err) => {}));
};

bot.reply = async (message, text, callback = () => {}) => {
    let replyEmbed = new MessageEmbed();
    replyEmbed.setDescription(text);
    replyEmbed.setColor('#226EB3');
    callback(await message.reply({ embeds: [replyEmbed] }).catch((err) => {}));
};

bot.usage = async (message, title, usage, callback = () => {}) => {
    let replyEmbed = new MessageEmbed();
    replyEmbed.setAuthor({
        name: title,
        iconURL: 'https://cdn.discordapp.com/emojis/874241155804594227.png',
    });
    replyEmbed.setDescription(usage);
    replyEmbed.setColor('#226EB3');
    callback(await message.reply({ embeds: [replyEmbed] }).catch((err) => {}));
};

bot.sendUsage = async (channel, title, usage, callback = () => {}) => {
    let replyEmbed = new MessageEmbed();
    replyEmbed.setAuthor({
        name: title,
        iconURL: 'https://cdn.discordapp.com/emojis/874241155804594227.png',
    });
    replyEmbed.setDescription(usage);
    replyEmbed.setColor('#226EB3');
    callback(await channel.send({ embeds: [replyEmbed] }).catch((err) => {}));
};

// module caching
bot.modules = {};
global.moduleRequire = (mod) => {
    if (bot.modules[mod]) return bot.modules[mod];
    bot.modules[mod] = require(mod);
    return bot.modules[mod];
};

// add global fetch extension
global.fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

bot.configs = {};
bot.db = {};

bot.ignoredPath = process.cwd() + '/ignore_watch/';

bot.commands = new Enmap();
bot.interactions = new Enmap();
bot.slash_commands = new Enmap();

var cacheJSON = require(cachePath);
bot.verifyIdentifiers = cacheJSON.verifyUsers || {};
bot.restartCommandUsed = cacheJSON.restartCommandUsed || {};

bot.verify = async (identifier) => {
    return new Promise((resolve, reject) => {
        var userThing = bot.verifyIdentifiers[identifier];
        bot.guilds.cache
            .get(bot.configs.general.guild_id)
            .members.fetch(userThing.id)
            .then((member) => {
                member.roles.add(bot.configs.general.verified_role);

                delete bot.verifyIdentifiers[identifier];
            });
        resolve(true);
    });
};

fs.readdir('./configs/', (error, files) => {
    if (error) throw error;
    files.forEach((file) => {
        try {
            if (!file.endsWith('.json')) return;
            const config = require(`./configs/${file}`);
            let configName = file.split('.')[0];
            bot.configs[configName] = config;
            bot.logger.debug(`[CONFIG LOADED] » configs.${configName}...`);
        } catch (error) {
            bot.error(error);
        }
    });
});

const mods = require('./modules.json');
// cache globally used modules
for (let modulename of mods.list) {
    try {
        let name = modulename;
        if (modulename.startsWith('./')) name = modulename.split('/')[modulename.split('/').length - 1];
        bot.modules[name] = require(modulename);
        bot.logger.debug('[CACHE MODULE LOADED] » ' + name);
    } catch (error) {
        bot.error(error);
    }
}

// init mongodb or json
require('./modules/database').setupDatabaseHandler(bot);
// require tools
bot.tools = moduleRequire('./tools');
// require sniper function
bot.sniper = {};
require('./modules/sniper')(bot);

// load bot events
fs.readdir('./events/', (error, files) => {
    if (error) throw error;
    files.forEach((file) => {
        try {
            if (!file.endsWith('.js')) return;
            const event = require(`./events/${file}`);
            let eventName = file.split('.')[0];
            bot.logger.debug(`[BOTEVENT LOADED] » ${eventName}...`);
            bot.on(eventName, event.bind(null, bot));
        } catch (error) {
            bot.error(error);
        }
    });
});

bot.aliases = [];
bot.commandKeys = [];
// load commands
fs.readdir('./commands/', (error, files) => {
    if (error) throw error;
    files.forEach((file) => {
        try {
            if (!file.endsWith('.js')) return;
            if (file.startsWith('_')) return;
            let props = require(`./commands/${file}`);
            if (props.active == true) {
                let commandName = file.split('.')[0];
                props.isCommand = true;
                bot.commands.set(commandName, props);
                if (props.similarityCheck == true) bot.commandKeys.push(commandName);
                if (props.aliases != null) {
                    for (let alias of props.aliases) {
                        if (!bot.aliases.includes(alias)) {
                            props.isCommand = false;
                            if (props.similarityCheck == true) bot.commandKeys.push(alias);
                            bot.aliases.push(alias);
                            bot.commands.set(alias, props);
                        } else {
                            bot.logger.debug('Could not add alias ' + alias + ' for command ' + commandName);
                        }
                    }
                }
                bot.logger.debug(`[COMMAND LOADED] >> ${commandName}... ${props.aliases != null && props.aliases.length > 0 ? 'Aliases: ' + props.aliases.join(', ') : 'Aliases: none'}`);
            }
        } catch (error) {
            bot.error(error);
        }
    });
});

// load interaction commands
fs.readdir('./interactions/', (error, files) => {
    if (error) throw error;
    files.forEach((file) => {
        try {
            if (!file.endsWith('.js')) return;
            if (file.startsWith('_')) return;
            let props = require(`./interactions/${file}`);
            if (props.active == true) {
                props.isCommand = true;
                let commandName = file.split('.')[0];
                bot.interaction_commands.set(commandName, props);
                bot.logger.debug(`[INTERACTION COMMAND LOADED] >> ${commandName}`);
            }
        } catch (error) {
            bot.error(error);
        }
    });
});

// load interaction commands
fs.readdir('./slash_commands/', (error, files) => {
    if (error) throw error;
    files.forEach((file) => {
        try {
            if (!file.endsWith('.js')) return;
            if (file.startsWith('_')) return;
            let props = require(`./slash_commands/${file}`);
            if (props.active == true) {
                props.isCommand = true;
                let commandName = file.split('.')[0];
                bot.slash_commands.set(commandName, props);
                bot.logger.debug(`[SLASH COMMAND LOADED] >> ${commandName}`);
            }
        } catch (error) {
            bot.error(error);
        }
    });
});

bot.memberCount = () => bot.guilds.cache.get(bot.configs.general.guild_id).memberCount;

bot.logger.emergency('Initialized cache save methods on SIGINT, SIGTERM and process.exit ... This may take a few seconds on each restart.');
process.on('SIGINT', () => {
    bot.logger.info('Saving cache to ' + cachePath);
    fs.writeFileSync(cachePath, JSON.stringify({ verifyUsers: bot.verifyIdentifiers, restartCommandUsed: bot.restartCommandUsed }));
    bot.logger.emergency('Have a great day :D');
});
process.on('SIGTERM', () => {
    bot.logger.info('Saving cache to ' + cachePath);
    fs.writeFileSync(cachePath, JSON.stringify({ verifyUsers: bot.verifyIdentifiers, restartCommandUsed: bot.restartCommandUsed }));
    bot.logger.emergency('Have a great day :D');
});
process.on('exit', () => {
    bot.logger.info('Saving cache to ' + cachePath);
    fs.writeFileSync(cachePath, JSON.stringify({ verifyUsers: bot.verifyIdentifiers, restartCommandUsed: bot.restartCommandUsed }));
    bot.logger.emergency('Have a great day :D');
});

// slash commands

bot.restClient = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);
bot.login(process.env.BOT_TOKEN);
