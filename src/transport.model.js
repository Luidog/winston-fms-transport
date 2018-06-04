'use strict';

const Transport = require('winston-transport');
const { Filemaker } = require('fms-api-client');

class FilemakerTransport extends Transport {
  constructor(opts) {
    super(opts);
    this.client = Filemaker.create({});
    this.application = opts.application;
    this.server = opts.server;
    this.level = opts.level;
    this.user = opts.user;
    this.password = opts.password;
    this.layout = opts.layout;
    this.messageField = opts.messageField;
    this.infoField = opts.infoField;
    this.layout = opts.layout;
    this.messageField = opts.messageField;
    this.infoField = opts.infoField;
  }

  log(info, callback) {
    let { level, message, ...data } = info;
    if (callback === undefined) callback = () => true;
      let payload = {};
      payload[this.messageField] = message;
      payload[this.infoField] = data;

      Filemaker.findOne({ _id: this.fmId })
        .then(client => this._createClient(client))
        .then(client => client.create(this.layout, payload))
        .then(record => callback())
        .catch(error => callback())
  }

  _createClient(client) {
    let newClient = Filemaker.create({
      application: this.application,
      server: this.server,
      user: this.user,
      password: this.password
    });
    return client
      ? client
      : newClient.save().then(client => {
          this.fmId = client._id;
          return client;
        });
  }
}

module.exports = { FilemakerTransport };
