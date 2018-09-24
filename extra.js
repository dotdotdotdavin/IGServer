var redis = require('redis');
const {promisify} = require('util');
client = redis.createClient(
    {host:process.env.IGREDISHOST,
    port:process.env.IGREDISPORT,
    password:process.env.IGREDISPASS
});
const getAsync = promisify(client.get).bind(client);
const hmsetAsync = promisify(client.hmset).bind(client);
const hsetAsync = promisify(client.hset).bind(client);
const hgetallAsync = promisify(client.hgetall).bind(client);
const hgetAsync = promisify(client.hget).bind(client);
const saddAsync = promisify(client.sadd).bind(client);
const hsetnxAsync = promisify(client.hsetnx).bind(client);
const existsAsync = promisify(client.exists).bind(client);
const smembersAsync = promisify(client.smembers).bind(client);
const keysAsync = promisify(client.keys).bind(client);
const hlenAsync = promisify(client.hlen).bind(client);


module.exports = {
    redis:redis,
    client:client,
    getAsync: getAsync,
    smembersAsync: smembersAsync,
    hmsetAsync: hmsetAsync,
    saddAsync: saddAsync,
    hsetnxAsync: hsetnxAsync,
    existsAsync: existsAsync,
    hgetallAsync: hgetallAsync,
    hgetAsync: hgetAsync,
    hsetAsync: hsetAsync,
    keysAsync: keysAsync,
    hlenAsync: hlenAsync
}
