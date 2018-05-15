'use strict';
const cookie = require('cookie');
const randomString = require('random-string');

module.exports = (req, res, next) => {
    req.reqId = randomString({length: 5});
    const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    logger.info(`${process.env.WORKER_ID} Access [${ip}] path:`, req.path, 'query:', JSON.stringify(req.query), 'params:', JSON.stringify(req.params), 'body:', JSON.stringify(req.body), `reqId:${req.reqId}`);
    req.startTime = new Date();
    req.userData = null;
    try {
        let cookies = cookie.parse(req.headers.cookie || '');
        const qr = `select email, saved_searches, custom_user_list from lookup_user where token = '${cookies.token}';`;
        logger.debug(qr, `reqId:${req.reqId}`);
        global.pgdb.query(qr, (err, result) => {
            if (err) {
                logger.error(err, `reqId:${req.reqId}`);
                next();
            } else if (result.rows.length === 0) {
                logger.info('User not found', JSON.stringify(cookies), `reqId:${req.reqId}`);
                next();
            } else {
                logger.info(`Logged in user:  ${result.rows[0].email}`, `reqId:${req.reqId}`);
                req.userData = {
                    email: result.rows[0].email,
                    saved_searches: result.rows[0].saved_searches,
                    custom_user_list: result.rows[0].custom_user_list,
                    token: cookies.token
                }
                next();
            }
        });
    } catch (e) {
        logger.error('Cookies or DB problem', e.message || e, `reqId:${req.reqId}`);
        next();
    }
}
