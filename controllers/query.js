
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
        permlink, author, title, body, author_reputation, 
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
        logger.warn('Bad page', req.body.page, `reqId:${req.reqId}`);
    }

    if (req.body.queryAuthorReputationMin) {
        queryDbParams.push(`author_reputation > ${parseInteger(req.body.queryAuthorReputationMin, 0)}`);
    }

    if (req.body.queryAuthorReputationMax) {
        queryDbParams.push(`author_reputation < ${parseInteger(req.body.queryAuthorReputationMax, 100)}`);
    }

    if (req.body.queryImageCountMin) {
        queryDbParams.push(`imagecount > ${parseInteger(req.body.queryImageCountMin, 0)}`);
    }

    if (req.body.queryImageCountMax) {
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

    if(req.body.queryTitleContains) {
        let queryTitleContains = req.body.queryTitleContains
        queryTitleContains = queryTitleContains
            .split(',')
            .map(q => `title ~* '\\m${q.trim()}\\M'`)
            .join(' or ')
        queryDbParams.push(
            queryTitleContains
        );
    }

    if(req.body.queryBodyContains) {
        let queryBodyContains =  req.body.queryBodyContains
        queryBodyContains = queryBodyContains
            .split(',')
            .map(q => `body ~* '\\m${q.trim()}\\M'`)
            .join(' or ')
        queryDbParams.push(
            queryBodyContains
        );
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

    let sortBy = 'created'
    let sortType = 'DESC'
    if(req.body.querySort) {
        let sort = req.body.querySort.split('-')
        if(
            sort[0] === 'created' ||
            sort[0] === 'author_reputation' ||
            sort[0] === 'pending_payout_value' ||
            sort[0] === 'children' ||
            sort[0] === 'net_votes' ||
            sort[0] === 'imagecount' ||
            sort[0] === 'wordcount'
        ) {
            sortBy = sort[0]
        } else {
            sortBy = 'created'
        }

        if(sort[1] === 'DESC' || sort[1] === 'ASC') {
            sortType = sort[1]
        }
        else {
            sortType = 'DESC'
        }
    }

    queryStr += ` ${queryDbParams.join(' AND ')} ORDER BY ${sortBy} ${sortType};`; // TODO LIMIT 100 afater tags fix
    // if low criteria present return just 1000 from db
    // if (queryDbParams.length < 3) {
    //     queryStr += ' LIMIT 1000;'
    // } else {
    //     queryStr += ';'
    // }
    // let lowCiteria = Object.keys(req.body).map(k => req.body[k]).join('').length < 19; // page and radio buttons in body

    logger.debug(JSON.stringify(queryStr).replace(/\\n/g, '').replace(/\s+/g, ' '), `reqId:${req.reqId}`);
    const dbTime = new Date();
    global.pgdb.query(queryStr, (err, result) => {
        logger.debug(`DB time: ${((new Date()) - dbTime)/1000} seconds`, `reqId:${req.reqId}`);
        if (err) {
            logger.error(err, `reqId:${req.reqId}`);

            res.json({
                error: 'no results',
                userData: req.userData
            });
            logger.debug(`Request took ${((new Date()) - req.startTime)/1000} seconds`, `reqId:${req.reqId}`);
            return;
        }

        let resultsTmp = result.rows.map(r => {
            let postThumbnail = null
            let exp = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))/ig;
            let foundUrls = r.body.match(exp)
            if(foundUrls) {
                postThumbnail = [foundUrls[0], foundUrls[1]]
            }

            if(postThumbnail === null) {
                postThumbnail = [`https://steemitimages.com/u/${r.author}/avatar`]
            }

            return {
                title: r.title,
                author: r.author,
                thumbnails: postThumbnail,
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


            if(req.body.tagsExcludeType === 'all') {
                resultsTmp = resultsTmp.filter(r => {
                    let sumOfContainingTags = 0
                    queryTagsExclude.forEach(t => {
                        if(r.tags.indexOf(t) > -1) {
                            sumOfContainingTags++
                        }
                    })
                    return !(sumOfContainingTags === queryTagsExclude.length)
                })
            }

            if(req.body.tagsExcludeType === 'any') {
                resultsTmp = resultsTmp.filter(r => {
                    let notExcluded = true
                    queryTagsExclude.forEach(t => {
                        if (r.tags.indexOf(t) > -1) {
                            notExcluded = false
                        }
                    });
                    return notExcluded;
                });
            }
        }

        if (req.body.queryExcludeMackbot === true) {
            resultsTmp = resultsTmp.filter(r => {
                return global.App.MackBot.indexOf(r.author) === -1;
            });
        }
        if(req.body.queryExcludeMyMackbot === true) {
            resultsTmp = resultsTmp.filter(r => {
                return req.body.myMackbotList.indexOf(r.author) === -1;
            })
        }
        // TODO END - MOVE THIS OUT
        let resultsToShow = 
        Number.isInteger(Number.parseInt(req.body.queryNumOfPostsToShow)) ? 
        Number.parseInt(req.body.queryNumOfPostsToShow) : 
        2000;

            res.json({
                totalResults: resultsTmp.length, // result.rows.length,
                results: resultsTmp.length > resultsToShow ? resultsTmp.slice(0, resultsToShow) : resultsTmp,
                userData: req.userData
            });
            logger.debug(`Request took ${((new Date()) - req.startTime)/1000} seconds`, `reqId:${req.reqId}`);

        // results.slice( (page - 1)*100, page*100 )
    })
}
