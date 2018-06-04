'use strict';
/* global describe before it */

/* eslint-disable */

const assert = require('assert');
const { expect } = require('chai');
const chai = require('chai');

/* eslint-enable */

const environment = require('dotenv');
const varium = require('varium');
const chaiAsPromised = require('chai-as-promised');
const { createLogger } = require('winston');
const { connect } = require('marpat');
const { FilemakerTransport } = require('../index.js');

environment.config({ path: './tests/.env' });
varium(process.env, './tests/env.manifest');

chai.use(chaiAsPromised);

describe('Client Test', () => {
  let logger, database;
  before(done => {
    connect('nedb://memory')
      .then(db => {
        database = db;
        return database.dropDatabase();
      })
      .then(() => {
        const filemakerTransport = level =>
          new FilemakerTransport({
            application: process.env.APPLICATION,
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
