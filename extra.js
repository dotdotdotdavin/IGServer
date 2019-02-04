var redis = require('redis');
const {promisify} = require('util');
client = redis.createClient(
    {
    // host:process.env.IGREDISHOST,
    // port:process.env.IGREDISPORT,
    // password:process.env.IGREDISPASS

    host:"redis-18397.c14.us-east-1-3.ec2.cloud.redislabs.com",
    port:18397,
    password:"aYI9ekj3wKX73ZlqkmJr6hv7xhTexyR7"

});
const getAsync = promisify(client.get).bind(client);
const delAsync = promisify(client.del).bind(client);
const hdelAsync = promisify(client.hdel).bind(client);
const hmsetAsync = promisify(client.hmset).bind(client);
const hsetAsync = promisify(client.hset).bind(client);
const hgetallAsync = promisify(client.hgetall).bind(client);
const hgetAsync = promisify(client.hget).bind(client);
const saddAsync = promisify(client.sadd).bind(client);
const hsetnxAsync = promisify(client.hsetnx).bind(client);
const existsAsync = promisify(client.exists).bind(client);
const hexistsAsync = promisify(client.hexists).bind(client);
const smembersAsync = promisify(client.smembers).bind(client);
const keysAsync = promisify(client.keys).bind(client);
const hlenAsync = promisify(client.hlen).bind(client);
const scanAsync = promisify(client.scan).bind(client);


module.exports = {
    redis:redis,
    client:client,
    getAsync: getAsync,
    smembersAsync: smembersAsync,
    hmsetAsync: hmsetAsync,
    saddAsync: saddAsync,
    hsetnxAsync: hsetnxAsync,
    existsAsync: existsAsync,
    hexistsAsync: hexistsAsync,
    hgetallAsync: hgetallAsync,
    hgetAsync: hgetAsync,
    hsetAsync: hsetAsync,
    keysAsync: keysAsync,
    hlenAsync: hlenAsync,
    scanAsync: scanAsync,
    delAsync: delAsync,
    hdelAsync: hdelAsync
}
