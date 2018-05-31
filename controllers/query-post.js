const steem = require('steem')
steem.api.setOptions({ url: process.env.STEEM_API_URL || 'https://api.steemit.com' });

module.exports = (req, res) => {
    const author = req.body.author;
    const link = req.body.permlink.split('/')[1];

    const qr1 = `SELECT * FROM
        (SELECT * FROM steem_posts WHERE permlink = '${author}/${link}')
        AS posts
        LEFT JOIN (SELECT name, vesting_shares FROM steem_user) as suh
        ON posts.author = suh.name;`;
    const qr2 = `SELECT * FROM steem_posts WHERE permlink = '${author}/${link}';`;
    let vestingSharesFromRedis;
    global.redis.get(`vesting_shares|${author}`)
        .then(vs => {
            logger.debug(`Got vs from redis ${author} = ${vs}`);
            vestingSharesFromRedis = vs;
            const qr = vs ? qr2 : qr1;
            logger.debug(qr);
            return global.pgdb_slave.query(qr2);
        })
        .then(results => {
            logger.debug(`Request took ${((new Date()) - req.startTime) / 1000} seconds`, `reqId:${req.reqId}`);
            const r = Object.assign(results.rows[0], {vesting_shares: vestingSharesFromRedis});
            r.steem_power = Math.floor(r.vesting_shares*global.App.vests2Sp).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            res.json(r);
        })
        .catch(e => {
            logger.error('PG or Redis broken', e, `reqId:${req.reqId}`);
            logger.debug(`Request took ${((new Date()) - req.startTime) / 1000} seconds`, `reqId:${req.reqId}`);
            res.json({ body: '...' });
        })
}
