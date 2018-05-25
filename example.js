'use strict';

const { connect } = require('marpat');
const { createLogger } = require('winston');
const environment = require('dotenv');
const varium = require('varium');
const { FilemakerTransport } = require('./index.js');

environment.config({ path: './tests/.env' });
varium(process.env, './tests/env.manifest');

connect('nedb://memory')
  .then(db => {
    const filemakerTransport = level =>
      new FilemakerTransport({
        application: process.env.APPLICATION,
        server: process.env.SERVER,
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        level: level,
        infoField: 'info',
        messageField: 'message',
        layout: 'Logs'
      });

    const logger = createLogger({
      transports: [filemakerTransport('silly')],
      exitOnError: false
    });

    logger.emitErrs = true;
    return logger;
  })
  .then(logger => logger.info('Message', { db: 'this is a message' }));
