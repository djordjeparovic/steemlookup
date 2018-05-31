'use strict';
const async = require('async');
const steem = require('steem');
steem.api.setOptions({ url: process.env.STEEM_API_URL || 'https://api.steemit.com' });
const normalizePost = require('./app/normalize-post.js');

global.logger = require('tracer').colorConsole({ // .console({
    format : "{{timestamp}} [{{title}}] {{message}}",
    dateformat : "HH:MM:ss"
});

global.timer = require('./utils/timer.js');

var pg = require('pg')
const Pool = pg.Pool;
const Client = pg.Client;
// fix for pg tz
pg.types.setTypeParser(1114, function(stringValue) {
    // console.log(stringValue); // DEBUG timestamps from DB
    return new Date(Date.parse(stringValue + "+0000"));
});

const pgdb = new Pool({
    user: process.env.PSQL_USER || 'steem_lookup_user',
    host: process.env.PSQL_HOST || '127.0.0.1',
    database: process.env.PSQL_DB || 'steem_lookup_v4',
    password: process.env.PSQL_PASS,
    port: process.env.PSQL_PORT || 5432
});
const pgdb_slave = new Pool({
    user: process.env.PSQL_USER || 'steem_lookup_user',
    host: process.env.PSQL_SLAVE_HOST || process.env.PSQL_HOST || '127.0.0.1',
    database: process.env.PSQL_DB || 'steem_lookup_v4',
    password: process.env.PSQL_PASS,
    port: process.env.PSQL_PORT || 5432
});
global.pgdb = pgdb;
global.pgdb_slave = pgdb_slave;

timer.start('posts-refresher');

let queryStr = `SELECT
        permlink, author, title, author_reputation, 
        created, last_visited, last_payout, tags, imageCount, wordCount, 
        children, active_votes, net_votes, pending_payout_value FROM steem_posts 
        WHERE created >= NOW() - INTERVAL '${process.env.MINUTES_END} minutes' 
        AND created <= NOW() - INTERVAL '${process.env.MINUTES_START} minutes'`;

global.pgdb_slave.query(queryStr, (err, pgresult) => {
    if (err) {
        logger.error(err);
        return;
    }
    async.eachSeries(pgresult.rows, (post, cb) => {
        const author = post.author;
        const link = post.permlink.split('/')[1];
        steem.api.getContent(author, link, function(err, post) {
            let getContentNormalizeError = false;
            if (err) {
                logger.error(err);
                cb(err);
                return;
            }
            let dbPost = {};
            try {
                dbPost = normalizePost(post);
            } catch (e) {
                logger.error('normalizePost error', e && e.message, e && e.stack, post);
                getContentNormalizeError = true;
            }

            if (getContentNormalizeError) {
                cb(null, {});
                return;
            }

            logger.info(dbPost.permlink);
            const pgQuery = {
                text: `
                UPDATE steem_posts SET author = ($2), title = ($3),
                author_reputation = ($4), created = ($5), last_visited = ($6),
                last_payout = ($7),
                tags = ($8),
                imageCount = ($9),
                wordCount = ($10),
                body = ($11),
                children = ($12),
                active_votes = ($13),
                net_votes = ($14),
                pending_payout_value = ($15)
                WHERE permlink = ($1);`,
                values: [
                    dbPost.permlink,
                    dbPost.author,
                    dbPost.title,
                    dbPost.author_reputation,
                    dbPost.created,
                    dbPost.last_visited,
                    dbPost.last_payout,
                    dbPost.tags,
                    dbPost.imageCount,
                    dbPost.wordCount,
                    dbPost.body,
                    dbPost.children,
                    dbPost.active_votes,
                    dbPost.net_votes,
                    dbPost.pending_payout_value
                ]
            };
            global.pgdb.query(pgQuery)
            .then(res => {
                cb(null, res);
            })
            .catch(e => {
                logger.error('DB error:', e);
                cb(e);
            });
        });
    }, (err, asyncData) => {
        if (err) {
            logger.error(err);
        } else {
            logger.info(`All OK. Job took ${timer.end('posts-refresher')}ms`);
            process.exit(1);
        }
    });
});
