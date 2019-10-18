'use strict';

const path = require('path');
const { connect } = require('marpat');
const { createLogger } = require('winston');
const environment = require('dotenv');
const varium = require('varium');
const { FilemakerTransport } = require('./index.js');

const manifestPath = path.join(__dirname, './test/env.manifest');

environment.config({ path: './test/.env' });
varium({ manifestPath });

//#connect-to-datastore
connect('nedb://memory')
  .then(db => {
    //#
    //#create-filemaker-transport
    const filemakerTransport = level =>
      new FilemakerTransport({
        database: process.env.DATABASE,
        server: process.env.SERVER,
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        infoField: 'info',
        messageField: 'message',
        layout: process.env.LAYOUT,
        level
      });
    //#
    //#add-logger-transport
    const logger = createLogger({
      transports: [filemakerTransport('silly')],
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
