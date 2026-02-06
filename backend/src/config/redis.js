
const  {createClient} = require('redis');

const redisClient = createClient({
    username: 'default',
    password: '3pvUhBOXmVrZZLdO40batAMfoMpn25Sq',
    socket: {
        host: 'redis-15331.crce217.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 15331
    }
});

module.exports=redisClient;

