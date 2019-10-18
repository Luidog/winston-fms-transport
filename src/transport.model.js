'use strict';

const Transport = require('winston-transport');
const { Filemaker } = require('fms-api-client');

/**
 * @class FilemakerTransport
 * @classdesc The class extended from winston-transport.
 */
class FilemakerTransport extends Transport {
  /** @constructs
   * @param {Object} options The options to use when constructing the Transport.
   * @param {String} options.database The FileMaker database to use for logs.
   * @param {String} options.server The FileMaker server to use for logs..
   * @param {String} options.user The FileMaker account to use for logs.
   * @param {String} options.password The FileMaker account password to use.
   * @param {String} options.layout The FileMaker layout to use when creating records.
   * @param {String} options.messageField The FileMaker field to use for the message property.
   * @param {String} options.infoField The FileMaker field to use for the info property.
   */
  constructor(options) {
    super(options);

    const {
      database,
      server,
      user,
      password,
      layout,
      messageField,
      infoField
    } = options;

    this.database = database;
    this.server = server;
    this.user = user;
    this.password = password;
    this.layout = layout;
    this.messageField = messageField;
    this.infoField = infoField;
  }
  /**
   * @method log
   * @public
   * @description The log method accepts an info parameter and a callback parameter. The method
   * will call the callback method when creating the FileMaker record is complete or an error is found.
   * @param  {object}   info     The log entry to send to FileMaker.
   * @param  {Function} callback The function to call when logging is complete
   * @return {Function}          The callback function to call
   */
  log(info, callback) {
    const { message, ...data } = info;
    if (callback === undefined) callback = () => true;
    if (!global.CLIENT) {
      console.log(
        'You must call connect before the FileMaker Transport will transport logs.'
      );
      return callback();
    }

    const payload = {};
    payload[this.messageField] = message;
    payload[this.infoField] = data;

    Filemaker.findOne({ _id: this._id })
      .then(client => this.create(client))
      .then(client => client.create(this.layout, payload))
      .then(record => callback())
      .catch(({ message }) => {
        console.log('FileMaker Transport Error', message);
        callback();
      });
  }
  /**
   * [create description]
   * @param  {Class} client An fms-api-client that has already been created.
   * @return {Class}        Either the original client or a newly created client.
   */
  create(client) {
    return client
      ? client
      : Filemaker.create({
          database: this.database,
          server: this.server,
          user: this.user,
          password: this.password
        }).then(client => {
          this._id = client._id;
          return client;
        });
  }
}

module.exports = { FilemakerTransport };
