'use strict';

const axios = require('axios');

module.exports = () => {
    logger.info('Pulling Mackbot.txt list');
    axios
    .get(`https://steemcleaners.org/bot/mackbot.txt`)
    .then(response => {
        if (response.data) {
            global.App.MackBot = response.data.split(/\r?\n/);
        } else {
            logger.error('No data in response from mackbot');
        }
    })
    .catch(e => {
        logger.error(e);
    });
}
