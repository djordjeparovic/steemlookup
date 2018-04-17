'use strict';

const postcssImport = require('postcss-import');
const postCssCustomProperties = require('postcss-custom-properties');
const autoprefixer = require('autoprefixer');
const postCssNested = require('postcss-nested');
const postCssCustomMedia = require('postcss-custom-media');

module.exports = {
    plugins: [
        postcssImport,
        postCssCustomProperties,
        autoprefixer,
        postCssNested,
        postCssCustomMedia
    ]
};

