'use strict';
/* global describe before it */

/* eslint-disable */

const assert = require('assert');
const { expect } = require('chai');
const chai = require('chai');

/* eslint-enable */

const path = require('path');
const environment = require('dotenv');
const varium = require('varium');
const { createLogger } = require('winston');
const { connect } = require('marpat');
const { FilemakerTransport } = require('../index.js');

const manifestPath = path.join(__dirname, './env.manifest');

describe('Client Test', () => {
  let logger;
  let database;
  before(done => {
    environment.config({ path: './tests/.env' });
    varium({ manifestPath });
    connect('nedb://memory')
      .then(db => {
        database = db;
        return database.dropDatabase();
      })
      .then(() => {
        const filemakerTransport = level =>
          new FilemakerTransport({
            database: process.env.DATABASE,
            server: process.env.SERVER,
            user: process.env.USERNAME,
            password: 'incorrect-password',
            infoField: 'info',
            messageField: 'message',
            layout: process.env.LAYOUT,
            level: level
          });

        logger = createLogger({
          transports: [filemakerTransport('silly')],
          exitOnError: false
        });

        logger.emitErrs = true;

        return logger;
      })
      .then(logger => done());
  });

  it('should reject if it can not send a message', () => {
    expect(logger.info('test message', { data: 'data' }))
      .to.be.an('object')
      .with.any.keys('level');
  });

  it('should reuse the same client to try and send a message', () => {
    expect(logger.info('test message', { data: 'data' }))
      .to.be.an('object')
      .with.any.keys('level');
  });
});
