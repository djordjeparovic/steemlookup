'use strict';

const sha256 = require('sha256');
const randomString = require('random-string');

module.exports = (req, res) => {
    if (req.userData && req.userData.token && req.body.customUserList) {
        global.pgdb.query(`update lookup_user set custom_user_list = '${req.body.customUserList}' where email = '${req.userData.email}' and token = '${req.userData.token}';`, (err, result) => {
            if (err) {
                logger.error(err, `reqId:${req.reqId}`);
                res.statusCode = 503;
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
    } else if (!req.body.customUserList) {
        res.statusCode = 403;
        logger.debug(`Request took ${((new Date()) - req.startTime)/1000} seconds`, `reqId:${req.reqId}`);
        res.json({
            status: 'fail',
            message: 'Missing customUserList data'
        });
    } else {
        res.statusCode = 403;
        logger.debug(`Request took ${((new Date()) - req.startTime)/1000} seconds`, `reqId:${req.reqId}`);
        res.json({
            status: 'fail',
            message: 'User is not logged in'
        });
    }
}
