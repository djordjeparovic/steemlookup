
module.exports = (req, res, next) => {
    const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    logger.info(`${process.env.WORKER_ID} Access [${ip}] path:`, req.path, 'query:', JSON.stringify(req.query), 'params:', JSON.stringify(req.params), 'body:', JSON.stringify(req.body));
    next();
}
