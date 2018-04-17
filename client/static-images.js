'use strict';

// This is the right place where you wish to add any images which should be
// 'copied' (+ optimization, maybe) to build directory

const req = require.context('./', true, /\.png$/);
req.keys().forEach(req);

const req1 = require.context('./img/', true, /\.ico$/);
req.keys().forEach(req1);

const req2 = require.context('./img/', true, /\.png$/);
req.keys().forEach(req2);

const req3 = require.context('./img/', true, /\.svg$/);
req.keys().forEach(req3);

const req4 = require.context('./img/', true, /\.xml$/);
req.keys().forEach(req4);
