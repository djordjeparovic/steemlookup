'use strict';

const sha256 = require('sha256');
const cookie = require('cookie');

module.exports = (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            throw new Error('Params missing');
        }
        if (req.body.password.length < 6) {
            throw new Error('Password too short');
        }

        const email = req.body.email.slice(0, 100).replace(`'`, '').trim();
        const password = sha256(req.body.password);

        global.pgdb_slave.query(`select token from lookup_user where email = '${email}' and password = '${password}'`, (err, result) => {
            if (err) {
                logger.error(err, `reqId:${req.reqId}`);
                res.statusCode = 503;
                logger.debug(`Request took ${((new Date()) - req.startTime)/1000} seconds`, `reqId:${req.reqId}`);
                res.json({
                    status: 'fail',
                    message: 'DB error'
                });
            } else if (result.rows.length === 0) {
                res.statusCode = 404;
                logger.debug(`Request took ${((new Date()) - req.startTime)/1000} seconds`, `reqId:${req.reqId}`);
                res.json({
                    status: 'fail',
                    message: 'User not found'
                });
            } else {
                res.setHeader('Set-Cookie', cookie.serialize('token', String(result.rows[0].token), {
                    httpOnly: true,
                    maxAge: 60 * 60 * 24 * 14 // 2 weeks
                }));
                logger.debug(`Request took ${((new Date()) - req.startTime)/1000} seconds`, `reqId:${req.reqId}`);
                res.json({
                    status: 'success',
                    token: result.rows[0].token
                });
            }
        });
    } catch (e) {
        logger.error(e && e.message, e && e.stack, `reqId:${req.reqId}`);
        logger.debug(`Request took ${((new Date()) - req.startTime)/1000} seconds`, `reqId:${req.reqId}`);
        res.json({
            status: 'fail',
            message: e.message
        });
    }
}
