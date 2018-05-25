'use strict';

const Transport = require('winston-transport');
const { Filemaker } = require('fms-api-client');

class FilemakerTransport extends Transport {
  constructor(opts) {
    super(opts);
    this.data = {};
    this.client = Filemaker.create({});
    this.data.application = opts.application;
    this.data.server = opts.server;
    this.data.user = opts.user;
    this.data.password = opts.password;
    this.data.layout = opts.layout;
    this.data.messageField = opts.messageField;
    this.data.infoField = opts.infoField;
    this.data.layout = opts.layout;
    this.data.messageField = opts.messageField;
    this.data.infoField = opts.infoField;
  }

  log(info, callback) {
    let payload = {};
    payload[this.data.messageField] = info.message;
    payload[this.data.infoField] = Object.assign(info, {
      message: undefined,
      level: undefined
    });

    Filemaker.findOne({ _id: this.data.fmId })
      .then(client => this.createClient(client))
      .then(client => client.create(this.data.layout, payload))
      .then(record => callback())
      .catch(error => {
        console.log('LogError', error);
        callback();
      });
  }

  createClient(client) {
    let newClient = Filemaker.create({
      application: this.data.application,
      server: this.data.server,
      user: this.data.user,
      password: this.data.password
    });
    return client
      ? client
      : newClient.save().then(client => {
          this.data.fmId = client._id;
          return client;
        });
  }
}

module.exports = { FilemakerTransport };
