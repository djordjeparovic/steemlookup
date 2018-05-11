require('datejs');
let lngDetector = new (require('languagedetect'));
let markdown = require( 'markdown').markdown;
let decode = require('decode-html');

module.exports = (o) => {
    let currentTime = new Date();

    let permlink = `${o.author}/${o.permlink}`;
    let author = o.author;
    let title = o.title.slice(0, 499);
    let author_reputation = o.author_reputation < 1000000000 ? 25: Math.floor((Math.log10(o.author_reputation)-9)*9+25);
    let created = Date.parse(o.created).toString('yyyy-MM-dd HH:mm:ss+00');
    let last_visited = currentTime.toString('yyyy-MM-dd HH:mm:ss+00');
    let last_payout = Date.parse(o.last_payout).toString('yyyy-MM-dd HH:mm:ss+00');

    let tags = '';
    let format = 'html';
    let imageCount = 0;
    try {
        if (JSON.parse(o.json_metadata).tags instanceof Array) {
            let metadata = JSON.parse(o.json_metadata);
            tags = metadata.tags.sort().join('|').slice(0, 499);
            format = metadata.format;
    
            if (metadata.image instanceof Array) {
                imageCount = metadata.image.length;
            }
        }
    } catch (e) {
        logger.error(e && e.message, 'for', permlink);
    }
    

    // const images = o.body.match(/(\.jpg)|(\.jpeg)|(\.gif)|(\.png)|(\.JPG)|(\.JPEG)|(\.GIF)|(\.PNG)/g);
    // if (images) {
    //     logger.info('CONTROL imageCount', imageCount, images.length);
    //     imageCount = images.length;
    // }

    let pureBody = o.body.replace(/!\[image\]\([^)]+\)/g, '')
        .replace(/\n/g, '')
        .split(/\s+/)
        .filter(l => l.length > 2);

    let wordCount = pureBody.length;
    let body = o.body;//.slice(0, 8000);
    body = body.replace(/https:\/\/steemitimages.com\/128x128\/http/g, 'http');
    switch (format) {
        case 'html': {
            body = body.slice(0, 20000);
        }
        case 'markdown':
        case 'markdown+html': {
            try {
                body = markdown.toHTML( body );
                body = body.replace('<html>', '');
                body = body.replace('</html>', '');

                if (body.indexOf('<p>&lt;') === 0) {
                    body = body.replace('<p>', '').replace('</p>', '');
                    body = decode(body);
                }
            } catch (er) {
                logger.error(er);
                body = body.slice(0, 20000);
            } 
        }
        default: {
            body = body.slice(0, 20000);
        }
    }

    // take title and body if body has more than 10 words
    let lang = lngDetector.detect(title + (wordCount < 10 ? '' : pureBody.join(' ')), 1);
    lang = lang && lang[0] && lang[0][0];
    if (lang === 'pidgin') { lang = 'english'; }

    let children = o.children;
    let active_votes = o.active_votes.map(v => v.voter).sort().join('|').slice(0, 8000);
    let net_votes = o.net_votes;
    let pending_payout_value = parseFloat(o.pending_payout_value);

    return {
        permlink,
        author,
        title,
        author_reputation,
        created,
        last_visited,
        last_payout,
        tags,
        imageCount,
        wordCount,
        body,
        children,
        active_votes,
        net_votes,
        pending_payout_value,
        lang
    }
};
