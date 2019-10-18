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

describe('Log Test', () => {
  let logger;
  let database;
  let filemakerTransport;
  before(done => {
    environment.config({ path: './test/.env' });
    varium({ manifestPath });
    connect('nedb://memory')
      .then(db => {
        database = db;
        return database.dropDatabase();
      })
      .then(() => {
        filemakerTransport = level =>
          new FilemakerTransport({
            database: process.env.DATABASE,
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
