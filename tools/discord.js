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

const similarity = moduleRequire('string-similarity');
const Discord = moduleRequire('discord.js');
const isDomain = moduleRequire('is-valid-domain');

module.exports = () => null;

module.exports.emojis = {
    // emoji export ( reactions/whatever )
    ZERO: '0️⃣',
    ONE: '1️⃣',
    TWO: '2️⃣',
    THREE: '3️⃣',
    FOUR: '4️⃣',
    FIVE: '5️⃣',
    SIX: '6️⃣',
    SEVEN: '7️⃣',
    EIGHT: '8️⃣',
    NINE: '9️⃣',
    TEN: '🔟',
    0: '0️⃣',
    1: '1️⃣',
    2: '2️⃣',
    3: '3️⃣',
    4: '4️⃣',
    5: '5️⃣',
    6: '6️⃣',
    7: '7️⃣',
    8: '8️⃣',
    9: '9️⃣',
    10: '🔟',
    A: ':regional_indicator_a:',
    B: ':regional_indicator_b:',
    C: ':regional_indicator_c:',
    D: ':regional_indicator_d:',
    E: ':regional_indicator_e:',
    F: ':regional_indicator_f:',
    G: ':regional_indicator_g:',
    H: ':regional_indicator_h:',
    I: ':regional_indicator_i:',
    J: ':regional_indicator_j:',
    K: ':regional_indicator_k:',
    L: ':regional_indicator_l:',
    M: ':regional_indicator_m:',
    N: ':regional_indicator_n:',
    O: ':regional_indicator_o:',
    P: ':regional_indicator_p:',
    Q: ':regional_indicator_q:',
    R: ':regional_indicator_r:',
    S: ':regional_indicator_s:',
    T: ':regional_indicator_t:',
    U: ':regional_indicator_u:',
    V: ':regional_indicator_v:',
    W: ':regional_indicator_w:',
    X: ':regional_indicator_x:',
    Y: ':regional_indicator_y:',
    Z: ':regional_indicator_z:',
    Ä: ':regional_indicator_a::regional_indicator_e:',
    Ö: ':regional_indicator_o::regional_indicator_e:',
    Ü: ':regional_indicator_u::regional_indicator_e:',
    SS: ':regional_indicator_s::regional_indicator_s:',
    '!': ':grey_exclamation:',
    '?': ':grey_question:',
};

// set a new bot status ( let the bot pick a random string of an array )
module.exports.setStatus = async (botInstance, activities_list) => {
    var index = Math.floor(Math.random() * activities_list.length);
    if (index < 0) index = 0;
    if (index >= activities_list.length) index = activities_list.length - 1;
    var txt = activities_list[index][0];
    var amount = 0;
    if (activities_list[index][1] != 'STREAMING') {
        botInstance.user.setActivity(txt, {
            type: activities_list[index][1] || 'PLAYING',
        });
    } else {
        botInstance.user.setActivity(txt, {
            type: 'STREAMING',
            url: activities_list[index][2] || 'https://google.com',
        });
    }
};

// set a new bot Status
module.exports.setBotStatus = async (botInstance, status, type) => {
    botInstance.user.setActivity(status || 'Leerer Status gesetzt', {
        type: type || 'PLAYING',
    });
};

// updateStatus is actually called each 2 min. in ready.js
module.exports.updateStatus = async (botInstance) => {
    botInstance.tools.discord.setStatus(botInstance, botInstance.configs.general.stati);
};

/**
 * send a embed with a given Object
 */
module.exports.sendEmbed = async (channel, data, cb) => {
    return new Promise(async (resolve, reject) => {
        try {
            let embed = new Discord.MessageEmbed();
            if (data.timestamp) embed.setTimestamp(data.timestamp);
            else if (data.timestamp != false) embed.setTimestamp();
            if (data.title) embed.setTitle(data.title);
            if (data.description) embed.setDescription(data.description);
            if (data.color) embed.setColor(data.color);
            else embed.setColor(15007859);
            if (data.author) {
                if (typeof data.author == 'object') {
                    embed.setAuthor({
                        name: data.author.text || data.author.name,
                        iconURL: data.author.image || data.author.image_url || data.author.icon_url,
                        url: data.author.url,
                    });
                } else {
                    embed.setAuthor({
                        name: data.author,
                    });
                }
            }
            if (data.thumbnail) {
                if (typeof data.thumbnail == 'object') {
                    embed.setThumbnail(data.thumbnail.url || data.thumbnail.image_url || data.thumbnail.image);
                } else {
                    embed.setThumbnail(data.thumbnail);
                }
            }
            if (data.image) {
                if (typeof data.image == 'object') {
                    embed.setImage(data.image.image || data.image.image_url || data.image.url);
                } else {
                    embed.setImage(data.image);
                }
            }
            if (data.footer) {
                if (typeof data.footer == 'object') {
                    embed.setFooter(data.footer.text, data.footer.image || data.footer.image_url || data.footer.url);
                } else {
                    embed.setFooter(data.footer);
                }
            } //  else embed.setFooter(process.env.BOT_NAME);
            if (data.fields) {
                for (let field of data.fields) {
                    if (field.name != '' && field.value != '') {
                        embed.addField(field.name, field.value, field.inline);
                    }
                }
            }
            if (data.url) embed.setURL(data.url);
            try {
                let msg;
                if (!data.components) {
                    msg = await channel.send({ embeds: [embed] });
                } else {
                    msg = await channel.send({ embeds: [embed], components: [...data.components] });
                }
                if (cb) await cb(msg);
                return resolve(msg);
            } catch (error) {
                try {
                    let errorEmbed = new Discord.MessageEmbed();
                    errorEmbed.setTitle('Error!');
                    errorEmbed.setDescription('```' + error.message.slice(0, 1990) + '```');
                    errorEmbed.setColor('#ff0000');
                    channel.send({ embeds: [errorEmbed] });
                } catch (err) {
                    reject(error);
                }
            }
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * reply a embed with a given Object
 */
module.exports.replyEmbed = async (message, data, cb) => {
    return new Promise(async (resolve, reject) => {
        try {
            let embed = new Discord.MessageEmbed();
            if (data.timestamp) embed.setTimestamp(data.timestamp);
            else if (data.timestamp != false) embed.setTimestamp();
            if (data.title) embed.setTitle(data.title);
            if (data.description) embed.setDescription(data.description);
            if (data.color) embed.setColor(data.color);
            else embed.setColor(15007859);
            if (data.author) {
                if (typeof data.author == 'object') {
                    embed.setAuthor({
                        name: data.author.text || data.author.name,
                        iconURL: data.author.image || data.author.image_url || data.author.icon_url,
                        url: data.author.url,
                    });
                } else {
                    embed.setAuthor({
                        name: data.author,
                    });
                }
            }
            if (data.thumbnail) {
                if (typeof data.thumbnail == 'object') {
                    embed.setThumbnail(data.thumbnail.url || data.thumbnail.image_url || data.thumbnail.image);
                } else {
                    embed.setThumbnail(data.thumbnail);
                }
            }
            if (data.image) {
                if (typeof data.image == 'object') {
                    embed.setImage(data.image.image || data.image.image_url || data.image.url);
                } else {
                    embed.setImage(data.image);
                }
            }
            if (data.footer) {
                if (typeof data.footer == 'object') {
                    embed.setFooter(data.footer.text, data.footer.image || data.footer.image_url || data.footer.url);
                } else {
                    embed.setFooter(data.footer);
                }
            } //  else embed.setFooter(process.env.BOT_NAME);
            if (data.fields) {
                for (let field of data.fields) {
                    if (field.name != '' && field.value != '') {
                        embed.addField(field.name, field.value, field.inline);
                    }
                }
            }
            if (data.url) embed.setURL(data.url);
            try {
                let msg;
                if (!data.components) {
                    msg = await message.reply({ embeds: [embed] });
                } else {
                    msg = await message.reply({ embeds: [embed], components: [...data.components] });
                }
                if (cb) await cb(msg);
                return resolve(msg);
            } catch (error) {
                try {
                    let errorEmbed = new Discord.MessageEmbed();
                    errorEmbed.setTitle('Error!');
                    errorEmbed.setDescription('```' + error.message.slice(0, 1990) + '```');
                    errorEmbed.setColor('#ff0000');
                    message.reply({ embeds: [errorEmbed] });
                } catch (err) {
                    reject(error);
                }
            }
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * create an embed with a given Object
 */
module.exports.generateEmbed = async (data, cb) => {
    return new Promise(async (resolve, reject) => {
        try {
            let embed = new Discord.MessageEmbed();
            if (data.timestamp) embed.setTimestamp(data.timestamp);
            else if (data.timestamp != false) embed.setTimestamp();
            if (data.title) embed.setTitle(data.title);
            if (data.description) embed.setDescription(data.description);
            if (data.color) embed.setColor(data.color);
            else embed.setColor(15007859);
            if (data.author) {
                if (typeof data.author == 'object') {
                    embed.setAuthor({
                        name: data.author.text || data.author.name,
                        iconURL: data.author.image || data.author.image_url || data.author.icon_url,
                        url: data.author.url,
                    });
                } else {
                    embed.setAuthor({
                        name: data.author,
                    });
                }
            }
            if (data.thumbnail) {
                if (typeof data.thumbnail == 'object') {
                    embed.setThumbnail(data.thumbnail.url || data.thumbnail.image_url || data.thumbnail.image);
                } else {
                    embed.setThumbnail(data.thumbnail);
                }
            }
            if (data.image) {
                if (typeof data.image == 'object') {
                    embed.setImage(data.image.image || data.image.image_url || data.image.url);
                } else {
                    embed.setImage(data.image);
                }
            }
            if (data.footer) {
                if (typeof data.footer == 'object') {
                    embed.setFooter(data.footer.text, data.footer.image || data.footer.image_url || data.footer.url);
                } else {
                    embed.setFooter(data.footer);
                }
            } // else embed.setFooter(process.env.BOT_NAME);
            if (data.fields) {
                for (let field of data.fields) {
                    if (field.name != '' && field.value != '') {
                        embed.addField(field.name, field.value, field.inline);
                    }
                }
            }
            if (data.url) embed.setURL(data.url);
            if (cb) await cb(embed);
            return resolve(embed);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports.isMemberPremium = (member) => {
    return member.premiumSince != null;
};

module.exports.getSimilarCommand = (botInstance, input) => {
    let commands = botInstance.commandKeys;
    let possibleCommands = similarity.findBestMatch(input, commands);
    if (!possibleCommands.bestMatch || possibleCommands.bestMatch.rating < 0.7) {
        return '';
    } else {
        return possibleCommands.bestMatch.target;
    }
};

module.exports.hasUserNitro = (user) => {
    if (!user) throw new Error('User cannot be null please fetch before.');
    var isPartner = false;
    try {
        isPartner = user.flags.has('PARTNERED_SERVER_OWNER');
    } catch (error) {}
    return user.displayAvatarURL({ dynamic: true }).endsWith('.gif') || isPartner || require('../configs/nitro.json').discriminators.includes(user.discriminator);
};

module.exports.hasMemberNitro = (member) => {
    if (!member) throw new Error('Member cannot be null please fetch before.');
    var presence_emoji = false;
    try {
        if (member.presence.activities != null) {
            member.presence.activities.forEach((activity) => {
                if (activity.emoji != null && activity.id == 'custom') {
                    if (activity.emoji.animated != null) presence_emoji = true;
                }
            });
        }
    } catch (error) {}
    var isPartner = false;
    try {
        isPartner = member.user.flags.has('PARTNERED_SERVER_OWNER');
    } catch (error) {}
    return presence_emoji || member.premiumSinceTimeStamp || member.premiumSubscriptionCount || 0 > 0 || member.user.displayAvatarURL({ dynamic: true }).endsWith('.gif') || isPartner || require('../configs/nitro.json').discriminators.includes(member.user.discriminator);
};

function trustPad(score) {
    var join = '';
    var scoreText = '' + (score <= 0 ? score : '+' + score);
    if (scoreText.length == 9) join += ' ';
    if (scoreText.length == 8) join += '  ';
    if (scoreText.length == 7) join += '   ';
    if (scoreText.length == 6) join += '    ';
    if (scoreText.length == 5) join += '     ';
    if (scoreText.length == 4) join += '      ';
    if (scoreText.length == 3) join += '       ';
    if (scoreText.length == 2) join += '        ';
    if (scoreText.length == 1) join += '         ';
    return scoreText + join + '-> /';
}

module.exports.calculateTrustScore = async (bot, member) => {
    return new Promise(async (resolve, reject) => {
        try {
            var trusts = [];
            if (member.user.bot) return resolve([100, [`${trustPad(100)}DiscordBot Detected`]]);
            var trust_config = bot.configs.general.trust_score;
            var trust = trust_config.base_trust;

            trusts.push(`${trustPad(trust_config.base_trust)}Base Trust`);

            // detext badges
            if (bot.tools.discord.hasMemberNitro(member)) {
                trust += trust_config.nitro;
                trusts.push(`${trustPad(trust_config.nitro)}Flag NITRO Detected`);
            } else trusts.push(`${trustPad(0)}NoFlag NITRO Detected`);
            var userFlags = member.user.flags || { has: () => false };
            if (userFlags.has('DISCORD_EMPLOYEE')) {
                trust += trust_config.staff;
                trusts.push(`${trustPad(trust_config.staff)}Flag DISCORD_EMPLOYEE Detected`);
            } else trusts.push(`${trustPad(0)}NoFlag DISCORD_EMPLOYEE Detected`);
            if (userFlags.has('PARTNERED_SERVER_OWNER')) {
                trust += trust_config.partner;
                trusts.push(`${trustPad(trust_config.partner)}Flag PARTNERED_SERVER_OWNER Detected`);
            } else trusts.push(`${trustPad(0)}NoFlag PARTNERED_SERVER_OWNER Detected`);
            if (userFlags.has('HYPESQUAD_EVENTS')) {
                trust += trust_config.hype_events;
                trusts.push(`${trustPad(trust_config.hype_events)}Flag HYPESQUAD_EVENTS Detected`);
            } else trusts.push(`${trustPad(0)}NoFlag HYPESQUAD_EVENTS Detected`);
            if (userFlags.has('HOUSE_BRAVERY')) {
                trust += trust_config.hype_bravery;
                trusts.push(`${trustPad(trust_config.hype_bravery)}Flag HOUSE_BRAVERY Detected`);
            } else trusts.push(`${trustPad(0)}NoFlag HOUSE_BRAVERY Detected`);
            if (userFlags.has('HOUSE_BRILLIANCE')) {
                trust += trust_config.hype_brilliance;
                trusts.push(`${trustPad(trust_config.hype_brilliance)}Flag HOUSE_BRILLIANCE Detected`);
            } else trusts.push(`${trustPad(0)}NoFlag HOUSE_BRILLIANCE Detected`);
            if (userFlags.has('HOUSE_BALANCE')) {
                trust += trust_config.hype_balance;
                trusts.push(`${trustPad(trust_config.hype_balance)}Flag HOUSE_BALANCE Detected`);
            } else trusts.push(`${trustPad(0)}NoFlag HOUSE_BALANCE Detected`);
            if (userFlags.has('EARLY_SUPPORTER')) {
                trust += trust_config.early_supporter;
                trusts.push(`${trustPad(trust_config.early_supporter)}Flag EARLY_SUPPORTER Detected`);
            } else trusts.push(`${trustPad(0)}NoFlag EARLY_SUPPORTER Detected`);
            if (userFlags.has('BUGHUNTER_LEVEL_1')) {
                trust += trust_config.bug_hunter_1;
                trusts.push(`${trustPad(trust_config.bug_hunter_1)}Flag BUGHUNTER_LEVEL_1 Detected`);
            } else trusts.push(`${trustPad(0)}NoFlag BUGHUNTER_LEVEL_1 Detected`);
            if (userFlags.has('BUGHUNTER_LEVEL_2')) {
                trust += trust_config.bug_hunter_2;
                trusts.push(`${trustPad(trust_config.bug_hunter_2)}Flag BUGHUNTER_LEVEL_2 Detected`);
            } else trusts.push(`${trustPad(0)}NoFlag BUGHUNTER_LEVEL_2 Detected`);
            if (userFlags.has('EARLY_VERIFIED_BOT_DEVELOPER')) {
                trust += trust_config.early_bot_dev;
                trusts.push(`${trustPad(trust_config.early_bot_dev)}Flag EARLY_VERIFIED_BOT_DEVELOPER Detected`);
            } else trusts.push(`${trustPad(0)}NoFlag EARLY_VERIFIED_BOT_DEVELOPER Detected`);
            if (userFlags.has('DISCORD_CERTIFIED_MODERATOR')) {
                trust += trust_config.mod;
                trusts.push(`${trustPad(trust_config.mod)}Flag DISCORD_CERTIFIED_MODERATOR Detected`);
            } else trusts.push(`${trustPad(0)}NoFlag DISCORD_CERTIFIED_MODERATOR Detected`);

            // detect custom status violations
            var userCustomStatus = [];
            try {
                userCustomStatus = member.presence.activities.filter((activity) => activity.id == 'custom');
                if (userCustomStatus.length >= 1) {
                    trust += trust_config.custom_status_existing;
                    trusts.push(`${trustPad(trust_config.custom_status_existing)}CustomStatus Detected`);
                    var text = userCustomStatus[0].state || '';
                    var args = text.split(/ +/g);
                    if (args.length > 0) {
                        var detectedDomainOrLink = false;
                        for (let part of args) {
                            if (isDomain(part) && part.includes('.')) {
                                detectedDomainOrLink = true;
                                break;
                            }
                            if (!part.startsWith('http')) part = 'http://' + part;
                            if (bot.tools.js.isUrl(part) && bot.tools.js.isValidUrl(part)) {
                                detectedDomainOrLink = true;
                                break;
                            }
                        }
                        if (detectedDomainOrLink) {
                            trust += trust_config.status_includes_domain_or_url;
                            trusts.push(`${trustPad(trust_config.status_includes_domain_or_url)}LinkCustomStatus Detected`);
                        } else {
                            trusts.push(`${trustPad(0)}NoLinkCustonStatus Detected`);
                        }
                        var detectedBlacklistWords = false;
                        for (let part of args) {
                            if (trust_config.blacklist.status.includes(part.toLowerCase())) {
                                detectedBlacklistWords = true;
                                trust += trust_config.blacklist.status_contains;
                                trusts.push(`${trustPad(trust_config.blacklist.status_contains)}BlacklistWordCustomStatus Detected - "${part}"`);
                            }
                        }
                        if (!detectedBlacklistWords) trusts.push(`${trustPad(0)}NoBlacklistWordCustomStatus Detected"`);
                    }
                } else {
                    trusts.push(`${trustPad(0)}NoCustomStatus Detected`);
                }
            } catch (error) {}

            // detect profile pictures
            if (!member.user.avatarURL()) {
                trust += trust_config.no_profile_picture;
                trusts.push(`${trustPad(trust_config.no_profile_picture)}NoProfilePicture Detected`);
            } else {
                trusts.push(`${trustPad(0)}ProfilePicture Detected`);
            }

            // detect account age
            var ageInDays = Math.trunc(bot.tools.js.msToDays(Date.now() - member.user.createdTimestamp));
            trust += Math.trunc(ageInDays * trust_config.account_age_per_day);
            trusts.push(`${trustPad(Math.trunc(ageInDays * trust_config.account_age_per_day))}Account Days`);

            var username = member.user.username;
            var alias = member.displayName;

            function checkNames(name, reason) {
                var args = name.split(/ +/g);
                if (args.length > 0) {
                    var detectedDomainOrLink = false;
                    for (let part of args) {
                        if (isDomain(part) && part.includes('.')) {
                            detectedDomainOrLink = true;
                            break;
                        }
                        if (!part.startsWith('http')) part = 'http://' + part;
                        if (bot.tools.js.isUrl(part) && bot.tools.js.isValidUrl(part)) {
                            detectedDomainOrLink = true;
                            break;
                        }
                    }
                    if (detectedDomainOrLink) {
                        trust += trust_config.names_includes_domain_or_url;
                        trusts.push(`${trustPad(trust_config.names_includes_domain_or_url)}Link${reason} Detected`);
                    } else {
                        trusts.push(`${trustPad(0)}NoLink${reason} Detected`);
                    }
                    var detectedBlacklistWords = false;
                    for (let part of args) {
                        if (trust_config.blacklist.names.includes(part.toLowerCase())) {
                            detectedBlacklistWords = true;
                            trust += trust_config.blacklist.names_contains;
                            trusts.push(`${trustPad(trust_config.blacklist.names_contains)}BlacklistWord${reason} Detected - "${part}"`);
                        }
                    }
                    if (!detectedBlacklistWords) trusts.push(`${trustPad(0)}NoBlacklistWord${reason} Detected`);
                }
            }

            checkNames(username, 'Username');
            if (username != alias) checkNames(alias, 'Alias');

            // calc status
            let userStatuses = member.presence ? member.presence.clientStatus || {} : {};

            if (member.presence && member.presence.status && member.presence.status != 'offline') {
                try {
                    if (userStatuses.desktop) {
                        if (userStatuses.desktop == 'dnd') {
                            trust += trust_config.dnd;
                            trusts.push(`${trustPad(trust_config.dnd)}Desktop DND Detected`);
                        }
                        if (userStatuses.desktop == 'idle') {
                            trust += trust_config.idle;
                            trusts.push(`${trustPad(trust_config.idle)}Desktop IDLE Detected`);
                        }
                        if (userStatuses.desktop == 'online') {
                            trust += trust_config.online;
                            trusts.push(`${trustPad(trust_config.online)}Desktop ONLINE Detected`);
                        }
                    }
                    if (userStatuses.mobile) {
                        if (userStatuses.mobile == 'dnd') {
                            trust += trust_config.mobile_dnd;
                            trusts.push(`${trustPad(trust_config.mobile_dnd)}Mobile DND Detected`);
                        }
                        if (userStatuses.mobile == 'idle') {
                            trust += trust_config.mobile_idle;
                            trusts.push(`${trustPad(trust_config.mobile_idle)}Mobile IDLE Detected`);
                        }
                        if (userStatuses.mobile == 'online') {
                            trust += trust_config.mobile_online;
                            trusts.push(`${trustPad(trust_config.mobile_online)}Mobile ONLINE Detected`);
                        }
                    }
                    if (userStatuses.web) {
                        trust += trust_config.browser;
                        trusts.push(`${trustPad(trust_config.browser)}Web ANY_STATUS Detected`);
                    }

                    // activity type detection
                    let activityTypeDetected = false;
                    var activities = member.presence.activities.filter((activity) => activity.id != 'custom');
                    var type = '';
                    try {
                        type = activities[0].type;
                    } catch (error) {
                        trusts.push(`${trustPad(trust_config.competing)}NoActivity Detected`);
                    }
                    for (let typesType of ['PLAYING', 'STREAMING', 'LISTENING', 'WATCHING', 'CUSTOM', 'COMPETING']) {
                        if (!activityTypeDetected) {
                            if (typesType == type) {
                                switch (typesType) {
                                    case 'PLAYING':
                                        trust += trust_config.playing;
                                        trusts.push(`${trustPad(trust_config.playing)}GameType PLAYING Detected`);
                                        break;
                                    case 'STREAMING':
                                        trust += trust_config.streaming;
                                        trusts.push(`${trustPad(trust_config.streaming)}GameType STREAMING Detected`);
                                        break;
                                    case 'LISTENING':
                                        trust += trust_config.listening;
                                        trusts.push(`${trustPad(trust_config.listening)}GameType LISTENING Detected`);
                                        break;
                                    case 'WATCHING':
                                        trust += trust_config.watching;
                                        trusts.push(`${trustPad(trust_config.watching)}GameType WATCHING Detected`);
                                        break;
                                    case 'COMPETING':
                                        trust += trust_config.competing;
                                        trusts.push(`${trustPad(trust_config.competing)}GameType COMPETING Detected`);
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    }
                } catch (error) {}
            } else {
                trust += trust_config.offline;
                trusts.push(`${trustPad(trust_config.offline)}Clients OFFLINE Detected`);
            }

            resolve([trust > 0 ? trust : 0, trusts]);
        } catch (error) {
            bot.error('Error' + error.stack);
            resolve([0, [`${trustPad(0)}Could Not Fetch User`]]);
        }
    });
};
