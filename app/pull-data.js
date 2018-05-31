const steem = require('steem');
steem.api.setOptions({ url: process.env.STEEM_API_URL || 'https://api.steemit.com' });
const async = require('async');
const normalizePost = require('./normalize-post.js');

module.exports = () => {
    logger.info('Updating posts...');
    const tid = `pull-data:${Math.random()}`;
    timer.start(tid);
    steem.api.getDiscussionsByCreated({
        limit: 100
    }, (err, results) => {
        if (err) {
            logger.error('Error in steem.api.getDiscussionsByCreated:', err);
            return;
        }

        logger.info(`Got ${results.length} results.`);

        async.eachSeries(results.filter(r => {
            return global.App.permlinks.indexOf(`${r.author}/${r.permlink}`) === -1;
        }), (post, cb) => {
            let dbPost;
            try {
                dbPost = normalizePost(post);
            } catch (e) {
                logger.error('normalizePost error', e && e.message, e && e.stack);
                cb(e);
                return null;
            }

            const pgQuery = {
                text: `INSERT INTO steem_posts(
                    permlink,
                    author,
                    title,
                    author_reputation,
                    created,
                    last_visited,
                    last_payout,
                    tags,
                    imageCount,
                    wordCount,
                    body,
                    children,
                    active_votes,
                    net_votes,
                    pending_payout_value,
                    lang,
                    thumbnails) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
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
                    dbPost.pending_payout_value,
                    dbPost.lang,
                    dbPost.thumbnails
                ]
            };

            global.App.permlinks.push(dbPost.permlink);
            global.redis.lpush('steem-users-update-que', dbPost.author)
            .then(rs => {
                return global.pgdb.query(pgQuery)
            })
            .then(res => {
                cb(null, res);
            })
            .catch(e => {
                logger.error('DB error:', e);
                cb(e);
            });
        }, (err) => {
            logger.info(`Job pull-data took: ${timer.end(tid)}ms`);
        });
    });
}
