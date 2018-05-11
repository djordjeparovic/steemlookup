'use strict';

const sha256 = require('sha256');
const cookie = require('cookie');

module.exports = (req, res) => {
    res.setHeader('Set-Cookie', cookie.serialize('token', null, {
        httpOnly: true,
        maxAge: -1
    }));
    logger.debug(`Request took ${((new Date()) - req.startTime)/1000} seconds`, `reqId:${req.reqId}`);
    res.json({
        status: 'success'
    });
}
