'use strict';
const { connect } = require('amqplib');

module.exports = class {
  /**
   * 初始化Amqp客户端
   * @param {*} config 配置
   * @param {*} app 应用
   */
  constructor(config, app) {
    this.config = config;
    this.app = app;
    this.connection = false;
    this.events = {
      connected: [],
      close: [],
    };
  }

  /**
   * 事件回调
   * @param {*} name 事件名
   * @param {*} callback 回调
   */
  on(name, callback) {
    if (!this.events[name]) return;
    this.events[name].push(callback);
  }

  /**
   * 事件触发
   * @param {*} name 事件名
   * @param {*} options 参数
   */
  trigger(name, options = {}) {
    if (!this.events[name]) return;
    options.client = this;
    this.events[name].forEach(func => func(options));
  }

  /**
   * MQ连接
   */
  async connect() {
    // 连接服务
    this.connection = await connect(this.config);
    const { hostname, port, vhost } = this.config;
    const name = `${hostname}:${port}${vhost}`;
    this.app.logger.info(`[egg-amqplibs] ${name} Connected`);
    // 错误重连
    this.connection.on('close', this.onClose.bind(this));
    this.connection.on('error', this.onClose.bind(this));
    // 事件触发
    this.trigger('connected');
  }

  /**
   * 服务断开事件
   * @param {*} err 异常
   */
  onClose(err) {
    this.trigger('close');
    this.connection = false;
    const { hostname, port, vhost } = this.config;
    const name = `${hostname}:${port}${vhost}`;
    this.app.logger.warn(`[egg-amqplibs] ${name} Close:`, err);
    this.connect();
  }

  /**
   * 获取链接信道
   * @return {Channel} 信道
   */
  createChannel() {
    return this.connection.createChannel();
  }
};
