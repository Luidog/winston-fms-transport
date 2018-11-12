'use strict';

const { connect } = require('marpat');
const { createLogger } = require('winston');
const environment = require('dotenv');
const varium = require('varium');
const { FilemakerTransport } = require('./index.js');

environment.config({ path: './tests/.env' });
varium(process.env, './tests/env.manifest');
//#connect-to-datastore
connect('nedb://memory')
  .then(db => {
    //#
    //#create-filemaker-transport
    const filemakerTransport = level =>
      new FilemakerTransport({
        application: process.env.APPLICATION,
        server: process.env.SERVER,
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        level: level,
        infoField: 'info',
        messageField: 'message',
        layout: process.env.LAYOUT
      });
    //#
    //#add-logger-transport
    const logger = createLogger({
      transports: [filemakerTransport('info')],
      exitOnError: false
    });
    //#
    return logger;

  })
  .then(logger => {
    //#use-logger-transport
    logger.silly('Message', { db: 'this is a message' });
    //#
    return logger;
  });
