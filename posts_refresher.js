'use strict';
const async = require('async');
const steem = require('steem');
const normalizePost = require('./app/normalize-post.js');

global.logger = require('tracer').colorConsole({ // .console({
    format : "{{timestamp}} [{{title}}] {{message}}",
    dateformat : "d mmm yy HH:MM:ss"
});

const ex = (code) => {
    logger.error('Code: ', code);
    process.exit(code);
}

process.on('uncaughtException', (err) => {
    logger.error(`Caught exception: ${err && err.message};${err}\n`);
    ex(2);
});

// it must finish in 40 minutes
setTimeout(() => {
    ex(4);
}, 40*60*1000);

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
    user: 'steem_lookup_user',
    host: process.env.PSQL_HOST || '127.0.0.1',
    database: process.env.NODE_ENV === 'production' ? 'steem_lookup_v2' : 'steem_lookup_v2_dev',
    password: process.env.PSQL_PASS,
    port: 5432
});
global.pgdb = pgdb;

timer.start('posts-refresher');

let queryStr = `SELECT
        permlink, author, title, author_reputation, 
        created, last_visited, last_payout, tags, imageCount, wordCount, 
        children, active_votes, net_votes, pending_payout_value FROM steem_posts 
        WHERE created >= NOW() - INTERVAL '${process.env.MINUTES_END} minutes' 
        AND created <= NOW() - INTERVAL '${process.env.MINUTES_START} minutes'`;

global.pgdb.query(queryStr, (err, pgresult) => {
    if (err) {
        logger.error(err);
        ex(3);
    }
    async.eachSeries(pgresult.rows, (post, cb) => {
        const author = post.author;
        const link = post.permlink.split('/')[1];
        if (author === '' || link === '') {
            logger.warn('Bad post', post);
            cb(null, {});
            return;
        }
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
                logger.error('normalizePost error', e, post);
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
            ex(2);
        } else {
            logger.info(`All OK. Job took ${timer.end('posts-refresher')}ms`);
            ex(1);
        }
    });
});
