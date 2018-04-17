/* eslint-disable global-require */

'use strict';

module.exports = (env) => {
    env = env || {};
    return require(`./webpack/${env.env}.js`)(env);
};

