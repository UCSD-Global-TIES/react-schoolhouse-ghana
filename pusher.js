require("dotenv").config();

const Pusher = require('pusher');

const pusher = new Pusher({
    appId: 'APP_ID',
    key: 'APP_KEY',
    secret: process.env.PUSHER_SECRET,
    cluster: 'CLUSTER',
    useTLS: true
  });

module.exports = pusher;