
global.timers = global.timers || {};

module.exports = {
    start: (str) => {
        global.timers[str] = new Date();
    },

    end: (str) => {
        const res = (new Date - global.timers[str]);
        delete global.timers[str];
        return res;
    }
}
