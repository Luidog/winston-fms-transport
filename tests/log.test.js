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

describe('Log Test', () => {
  let logger, database, filemakerTransport;
  before(done => {
    connect('nedb://memory')
      .then(db => {
        database = db;
        return database.dropDatabase();
      })
      .then(() => {
        filemakerTransport = level =>
          new FilemakerTransport({
            application: process.env.APPLICATION,
            server: process.env.SERVER,
            user: process.env.USERNAME,
            password: process.env.PASSWORD,
            infoField: 'info',
            messageField: 'message',
            layout: process.env.LAYOUT,
            level: level
          });

        logger = createLogger({
          transports: [filemakerTransport('info')],
          exitOnError: false
        });

        logger.emitErrs = true;

        return logger;
      })
      .then(logger => done());
  });

  it('should be able send a log to FileMaker', () => {
    expect(logger.info('test message', { data: 'data' }))
      .to.be.an('object')
      .with.any.keys('level');
  });

  it('should be able send multiple messages on the same client', () => {
    expect(logger.info('test message', { data: 'data' }))
      .to.be.an('object')
      .with.any.keys('level');
  });
});
