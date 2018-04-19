
const time_ago = require('../utils/timeAgo.js');
require('datejs');

function parseInteger(value, defaultValue) {
    let v = defaultValue;
    try {
        v = parseInt(value);
    } catch (e) {
        logger.warn('Cannot parse ', v);
    }

    // NaN
    if (v !== v) {
        v = defaultValue;
    }
    return v;
}

module.exports = (req, res) => {
    // body not included
    let queryStr = `SELECT
        permlink, author, title, author_reputation, 
        created, last_visited, last_payout, tags, imageCount, wordCount, 
        children, active_votes, net_votes, pending_payout_value FROM steem_posts 
        WHERE `;
    let queryDbParams = [];
    let page = 1;
    const pageSize = 100;

    try {
        page = parseInt(req.body.page);
        if (page < 1) {
            page = 1;
        }
    } catch (e) {
        logger.warn('Bad page', req.body.page);
    }

    if (req.body.queryAuthorReputationMin) {
        queryDbParams.push(`author_reputation > ${parseInteger(req.body.queryAuthorReputationMin, 0)}`);
    }

    if (req.body.queryAuthorReputationMax) {
        queryDbParams.push(`author_reputation < ${parseInteger(req.body.queryAuthorReputationMax, 100)}`);
    }

    if (req.body.queryImageCountMin) {
        queryDbParams.push(`imageCount > ${parseInteger(req.body.queryImageCountMin, 0)}`);
    }

    if (req.body.queryImageCountMin) {
        queryDbParams.push(`imagecount < ${parseInteger(req.body.queryImageCountMax, 100)}`);
    }

    if (req.body.queryWordCountMin) {
        queryDbParams.push(`wordcount > ${parseInteger(req.body.queryWordCountMin, 0)}`);
    }
    if (req.body.queryWordCountMax) {
        queryDbParams.push(`wordcount < ${parseInteger(req.body.queryWordCountMax, 100)}`);
    }

    if (req.body.queryCommentCountMin) {
        queryDbParams.push(`children > ${parseInteger(req.body.queryCommentCountMin, 0)}`);
    }
    if (req.body.queryCommentCountMax) {
        queryDbParams.push(`children < ${parseInteger(req.body.queryCommentCountMax, 100)}`);
    }

    if (req.body.queryPendingPayoutMin) {
        queryDbParams.push(`pending_payout_value > ${parseFloat(req.body.queryPendingPayoutMin)}`);
    }
    if (req.body.queryPendingPayoutMax) {
        queryDbParams.push(`pending_payout_value < ${parseFloat(req.body.queryPendingPayoutMax)}`);
    }

    if (req.body.queryStartDate) {
        queryDbParams.push(`created >= '${Date.parse(req.body.queryStartDate).toString('yyyy-MM-dd HH:mm:ss+00')}'`);
    }
    if (req.body.queryEndDate) {
        queryDbParams.push(`created <= '${Date.parse(req.body.queryEndDate).toString('yyyy-MM-dd HH:mm:ss+00')}'`);
    }

    if (req.body.queryMinutesAgoStart) {
        let minutesAgoStart = ('' + req.body.queryMinutesAgoStart).replace(/[^\d]/g, '')
        queryDbParams.push(`created >= NOW() - INTERVAL '${minutesAgoStart} minutes'`);
    }
    if (req.body.queryMinutesAgoEnd) {
        let minutesAgoEnd = ('' + req.body.queryMinutesAgoEnd).replace(/[^\d]/g, '')
        queryDbParams.push(`created <= NOW() - INTERVAL '${minutesAgoEnd} minutes'`);
    }

    if (req.body.queryLanguage) {
        queryDbParams.push(`lang = '${req.body.queryLanguage}'`);
    }

    if (req.body.queryVoteCountMin) {
        queryDbParams.push(`net_votes >= '${req.body.queryVoteCountMin}'`);
    }

    if (req.body.queryVoteCountMax) {
        queryDbParams.push(`net_votes <= '${req.body.queryVoteCountMax}'`);
    }

    // Fix for empty query
    if (queryDbParams.length === 0) {
        queryDbParams.push('imagecount >= 0');
    }

    let responseSentFromCache = false;
    if (queryDbParams.length == 1 && queryDbParams[0] === `created >= NOW() - INTERVAL '1440 minutes'`
    && global.emptyQueryCache && req.body.queryExcludeMackbot === false) {
        responseSentFromCache = true;
        res.json(global.emptyQueryCache);
    }

    queryStr += ` ${queryDbParams.join(' AND ')} ORDER BY created DESC;`; // TODO LIMIT 100 afater tags fix
    // if low criteria present return just 1000 from db
    // if (queryDbParams.length < 3) {
    //     queryStr += ' LIMIT 1000;'
    // } else {
    //     queryStr += ';'
    // }
    // let lowCiteria = Object.keys(req.body).map(k => req.body[k]).join('').length < 19; // page and radio buttons in body

    logger.info(JSON.stringify(queryStr));
    global.pgdb.query(queryStr, (err, result) => {
        if (err) {
            logger.error(err);

            !responseSentFromCache &&
            res.json({
                error: 'no results'
            });
            return;
        }

        let resultsTmp = result.rows.map(r => {
            return {
                title: r.title,
                author: r.author,
                permlink: r.permlink,
                author_reputation: r.author_reputation,
                created: r.created,
                tags: r.tags && r.tags.split('|') || [],
                imageCount: r.imagecount,
                wordCount: r.wordcount,
                children: r.children,
                net_votes: r.net_votes,
                pending_payout_value: r.pending_payout_value,
                minutes_ago: time_ago(r.created, new Date())
            }
        });

        // TODO - MOVE THIS OUT AND FILTER USING PSQL
        if (req.body.queryTagsInclude) {
            let queryTagsInclude = req.body.queryTagsInclude
                .split(',')
                .join('!__SEP1RAT0R__!')
                .split(' ')
                .join('!__SEP1RAT0R__!')
                .split('!__SEP1RAT0R__!')
                .filter(a => a.length > 0);

            if (req.body.tagsIncludeType === 'all') {
                resultsTmp = resultsTmp.filter(r => {
                    return r.tags.filter(a => queryTagsInclude.includes(a)).length === queryTagsInclude.length;
                });
            }

            if (req.body.tagsIncludeType === 'any') {
                resultsTmp = resultsTmp.filter(r => {
                    let sum = 0;
                    queryTagsInclude.forEach(t => {
                        if (r.tags.includes(t)) {
                            sum += 1;
                        }
                    });
                    return sum > 0;
                });
            }
        }

        if (req.body.queryTagsExclude) {
            let queryTagsExclude = req.body.queryTagsExclude
                .split(',')
                .join('!__SEP1RAT0R__!')
                .split(' ')
                .join('!__SEP1RAT0R__!')
                .split('!__SEP1RAT0R__!')
                .filter(a => a.length > 0);

            resultsTmp = resultsTmp.filter(r => {
                let exclude = true;
                queryTagsExclude.forEach(t => {
                    if (r.tags.indexOf(t) > -1) {
                        exclude = false; // remove this post from results
                    }
                });
                // logger.warn(`${queryTagsExclude} --- ${r.tags}   ==   ${exclude}`);
                return exclude;
            });
        }

        if (req.body.queryExcludeMackbot === true) {
            resultsTmp = resultsTmp.filter(r => {
                return global.App.MackBot.indexOf(r.author) === -1;
            });
        }
        // TODO END - MOVE THIS OUT

        if (queryDbParams.length == 1 && queryDbParams[0] === `created >= NOW() - INTERVAL '1440 minutes'` && req.body.queryExcludeMackbot === false) {
            global.emptyQueryCache = {
                totalResults: resultsTmp.length, // result.rows.length,
                results: resultsTmp.length > 2000 ? resultsTmp.slice(0, 500) : resultsTmp
            }
            !responseSentFromCache &&
            res.json({
                totalResults: resultsTmp.length, // result.rows.length,
                results: resultsTmp.length > 2000 ? resultsTmp.slice(0, 500) : resultsTmp
            });
        } else {
            !responseSentFromCache &&
            res.json({
                totalResults: resultsTmp.length, // result.rows.length,
                results: resultsTmp.length > 2000 ? resultsTmp.slice(0, 500) : resultsTmp
            });
        }
        // results.slice( (page - 1)*100, page*100 )
    })
}
