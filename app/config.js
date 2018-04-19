
module.exports = {
    port: process.env.PORT || 9011,
    stateFile: '/tmp/steemlookup-state.json',
    intervals: {
        'pull-data': 20000, // 20 sec
        'refresh-mackbot-list': 15*60000, // 15 min
    }
}
