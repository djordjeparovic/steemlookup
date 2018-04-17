
module.exports = (req, res, next) => {
    const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    logger.info(`Access [${ip}] path:`, req.path, 'query:', req.query, 'params:', req.params, 'body:', req.body);
    next();
}
