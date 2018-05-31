const redis = require('redis');
const {promisify} = require('util');

class Redis {
    constructor(host = 'localhost', password) {
        this.client = redis.createClient({
            host: host,
            password: password
        });

        this.client.on('error', function (err) {
            logger.error('Redis client error:' + err);
        });

        this.set = promisify(this.client.set).bind(this.client);
        this.get = promisify(this.client.get).bind(this.client);

        this.llen = promisify(this.client.llen).bind(this.client);
        this.lrange = promisify(this.client.lrange).bind(this.client);
        this.rpush = promisify(this.client.rpush).bind(this.client);
        this.lpush = promisify(this.client.lpush).bind(this.client);
        this.rpop = promisify(this.client.rpop).bind(this.client);
        this.lpop = promisify(this.client.lpop).bind(this.client);
    }
}

module.exports = Redis;
