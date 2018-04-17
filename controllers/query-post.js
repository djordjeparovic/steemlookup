const steem = require('steem')

module.exports = (req, res) => {
    try {
        const author = req.body.author;
        const link = req.body.permlink.split('/')[1];

        global.pgdb.query(`select * from steem_posts where permlink = '${author}/${link}'`, (err, results) => {
            if (err) {
                logger.error(err);
                res.json({status: 'error'});
            } else {
                res.json(results.rows[0]);
            }
        });
    } catch (e) {
        logger.error(e);
        res.json({ body: '...' });
    }
}
