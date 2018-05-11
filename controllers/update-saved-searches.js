'use strict';

const sha256 = require('sha256');
const randomString = require('random-string');

module.exports = (req, res) => {
    if (req.userData && req.userData.token && req.body.savedSearches) {
        global.pgdb.query(`update lookup_user set saved_searches = '${req.body.savedSearches}' where email = '${req.userData.email}' and token = '${req.userData.token}';`, (err, result) => {
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
    } else if (!req.body.savedSearches) {
        res.statusCode = 403;
        logger.debug(`Request took ${((new Date()) - req.startTime)/1000} seconds`, `reqId:${req.reqId}`);
        res.json({
            status: 'fail',
            message: 'Missing savedSearches data'
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
