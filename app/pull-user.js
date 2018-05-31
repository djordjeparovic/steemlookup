const steem = require('steem');
steem.api.setOptions({ url: process.env.STEEM_API_URL || 'https://api.steemit.com' });
const async = require('async');
const normalizeUser = require('./normalize-user.js');

module.exports = () => {
    global.redis.rpop('steem-users-update-que')
        .then(author => {
            if (author) {
                logger.info(`pull data for author ${author}`);
                steem.api.getAccounts([author], function (err, result) {
                    if (err) {
                        logger.error('Error in steem.api.getAccounts:', err);
                        return;
                    } try {
                        let dbUser = normalizeUser(result[0]);
                        const vls = Array.apply(null, new Array(Object.keys(dbUser).length)).map((j, i) => `$${i + 1}`);
                        const pgQuery1 = {
                            text: `INSERT into steem_user (
                    ${Object.keys(dbUser).join(',')}
                ) VALUES (
                    ${vls.join(',')}
                ) ON CONFLICT (name) DO UPDATE SET ${Object.keys(dbUser).map((k, i) => {
                                    return `${k} = ${vls[i]}`
                                }).join(',')};`,
                            values: Object.keys(dbUser).map(k => {
                                return dbUser[k]
                            })
                        };

                        Promise.all([
                            global.pgdb.query(pgQuery1),
                            global.redis.set(`vesting_shares|${author}`, dbUser.vesting_shares, 'EX', 604800) // 7 days
                        ]).then(res => {
                            logger.info(`done pull-user for ${author}`);
                        })
                            .catch(e => {
                                logger.error('DB steem_user error:', e);
                            });

                    } catch (e) {
                        logger.error(e);
                        return;
                    }
                });
            }
        })
        .catch(e => {
            logger.error('Pull-user error', e && e.message, e && e.stack);
        })
}
