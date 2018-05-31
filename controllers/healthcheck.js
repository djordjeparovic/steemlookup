
module.exports = (req, res) => {
    global.redis.llen('steem-users-update-que')
    .then(l => {
        res.json({
            status: 'ok',
            updateUsersQueue: l
        })
    })
    .catch(e => {
        res.json({
            status: 'fail',
            message: 'redis-broken'
        })
    })
}
