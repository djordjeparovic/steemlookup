'use strict';

const sha256 = require('sha256');
const randomString = require('random-string');

module.exports = (req, res) => {
    try {
        if (!req.body.name || !req.body.email || !req.body.password) {
            throw new Error('Params missing');
        }
        if (req.body.password.length < 6) {
            throw new Error('Password too short');
        }

        const name = req.body.name.slice(0, 100).replace(`'`, '');
        const email = req.body.email.slice(0, 100).replace(`'`, '').trim();
        const password = sha256(req.body.password);
        const currToken = randomString({length: 48});

        global.pgdb.query(`insert into lookup_user(name, email, password, token) values('${name}', '${email}', '${password}', '${currToken}')`, (err, result) => {
            if (err) {
                logger.error(err, `reqId:${req.reqId}`);
                logger.debug(`Request took ${((new Date()) - req.startTime)/1000} seconds`, `reqId:${req.reqId}`);
                res.json({
                    status: 'fail',
                    message: 'DB error'
                });
            } else {
                logger.debug(`Request took ${((new Date()) - req.startTime)/1000} seconds`, `reqId:${req.reqId}`);
                res.json({
                    status: 'success'
                });
            }
        });
    } catch (e) {
        logger.error(e.message || e, `reqId:${req.reqId}`);
        logger.debug(`Request took ${((new Date()) - req.startTime)/1000} seconds`, `reqId:${req.reqId}`);
        res.json({
            status: 'fail',
            message: e.message
        });
    }
}
