'use strict';

const Transport = require('winston-transport');
const { Filemaker } = require('fms-api-client');

class FilemakerTransport extends Transport {
  constructor(opts) {
    super(opts);

    let client = Filemaker.create(opts.client);
    this.layout = opts.layout;
    this.messageField = opts.messageField;
    this.infoField = opts.infoField;
    client.save().then(client => {
      this.layout = opts.layout;
      this.messageField = opts.messageField;
      this.infoField = opts.infoField;
      this.id = client._id;
    });
  }

  log(info, callback) {
    console.log(info);
    console.log(this);
    Object.assign({ messageField: '' }, {});
    Filemaker.findOne({ _id: this.id })
      .then(client => client.create(this.layout, {}))
      .then(record => callback())
      .catch(error => callback());
  }
}
module.exports = { FilemakerTransport };
