const express = require('express')
const bs = require('body-parser')
const compression = require('compression')
const cors = require('cors')
const expressNunjucks = require('express-nunjucks')
const _ = require('lodash')
const fs = require('fs')
const cookie = require('cookie')
global.logger = require('tracer').colorConsole({ // .console({
    format : "{{timestamp}} [{{title}}] {{message}}",
    dateformat : "d mmm yy HH:MM:ss"
});

// DB
var pg = require('pg')
const Pool = pg.Pool;
const Client = pg.Client;
// fix for pg tz
pg.types.setTypeParser(1114, function(stringValue) {
    // console.log(stringValue); // DEBUG timestamps from DB
    return new Date(Date.parse(stringValue + "+0000"));
});
const pgdb = new Pool({
    user: process.env.PSQL_USER || 'steem_lookup_user',
    host: process.env.PSQL_HOST || '127.0.0.1',
    database: process.env.PSQL_DB || 'steem_lookup_v4',
    password: process.env.PSQL_PASS,
    port: process.env.PSQL_PORT || 5432
});
const pgdb_slave = new Pool({
    user: process.env.PSQL_USER || 'steem_lookup_user',
    host: process.env.PSQL_SLAVE_HOST || process.env.PSQL_HOST || '127.0.0.1',
    database: process.env.PSQL_DB || 'steem_lookup_v4',
    password: process.env.PSQL_PASS,
    port: process.env.PSQL_PORT || 5432
});
global.pgdb = pgdb;
global.pgdb_slave = pgdb_slave;
const Redis = require('./utils/redis.js')
const redis = new Redis(process.env.REDIS_HOST, process.env.REDIS_PASS);
global.redis = redis;

const middlewares = require('./middlewares');
global.timer = require('./utils/timer.js');
const fixCssPaths = require('./utils/fixCssPaths.js');
const appConfig = require('./app/config.js');
require('datejs');

const router = require('./router.json');

const app = express()
app.use(express.static('build'))
app.use(compression())
app.use(cors())
app.use(bs.json());
app.use(middlewares)

app.use(bs.text({type: '*/*'}));
app.set('views', __dirname + '/templates');
const enj = expressNunjucks(app, {
    watch: false,
    noCache: false
});
const domainMap = {
    development: '//localhost:9011/',
    alpha: '//alpha.steemlookup.com/',
    beta: '//beta.steemlookup.com/',
    prod: '//steemlookup.com/'
};
fixCssPaths({
    env: 'prod', // process.env.NODE_ENV,
    paths: domainMap,
    files: [
        '/build/style.css'
    ]
});

global.App = {
    MackBot: [],
    permlinks: [],
    vests2Sp: 0.000491809
};

global.pgdb.query(`select permlink from steem_posts where created >= NOW() - INTERVAL '600 minutes';`, (err, results) => {
    global.App.permlinks = results.rows.map(r => r.permlink);
    logger.info(`Found ${global.App.permlinks.length} posts in steem_posts table`);
});

app.listen(appConfig.port, function () {
    logger.info(`SteemLookup.com app started on :${appConfig.port}`);
})

// Timers logic
const pullData = require('./app/pull-data.js');
const pullUser = require('./app/pull-user.js');
const refreshMackbot = require('./app/refresh-mackbot-list.js');
if (process.env.PULL_DATA !== 'false') {
    pullData();
    setInterval(() => pullData(), appConfig.intervals['pull-data']);
    setInterval(() => pullUser(), appConfig.intervals['pull-user']);
}

refreshMackbot();
setInterval(() => refreshMackbot(), appConfig.intervals['refresh-mackbot-list']);

router.routes.forEach((route) => {
    app[ route.method ] (route.path, require('./controllers/' + route.controller));
})

var exitHandler = function (e) {
    if (global.isAlreadyDown) {
        return; // dont call exitHandler more than once
    }

    logger.info('Processing exit handler\nError:', e);
    // save current app state
    fs.writeFileSync(appConfig.stateFile, JSON.stringify(global.App));
    global.isAlreadyDown = true;
    process.exit()
}

process.on('SIGINT', exitHandler)
process.on('uncaughtException', exitHandler)
