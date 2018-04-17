'use strict';

const fs = require('fs');
const path = require('path');
const prefixer = require('postcss-prefix-selector');
const postcss = require('postcss');

module.exports = options => (options) => {
    options.files.forEach((styleFile) => {
        let style = fs.readFileSync(path.normalize(process.cwd() + styleFile), 'utf-8');

        style = style.replace(/\/\/localhost:9011\//g, options.paths[options.env]);
        fs.writeFileSync(path.normalize(process.cwd() + styleFile), style);
    });
};
