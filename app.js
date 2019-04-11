'use strict';
const assert = require('assert');
const AmqpClient = require('./libs/client');

const createAmqps = (config, app) => {
  assert(
    config.hostname &&
      config.port &&
      config.username &&
      config.password &&
      config.vhost
  );
  const client = new AmqpClient(config, app);
  app.beforeStart(async () => {
    await client.connect();
  });

  return client;
};

module.exports = app => {
  app.addSingleton('amqp', createAmqps);
};
