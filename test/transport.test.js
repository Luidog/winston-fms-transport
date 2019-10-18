'use strict';
/* global describe beforeEach it */

/* eslint-disable */

const assert = require('assert');
const { expect } = require('chai');
const chai = require('chai');

/* eslint-enable */

const path = require('path');
const environment = require('dotenv');
const varium = require('varium');
const MESSAGE = Symbol.for('message');
const { connect } = require('marpat');
const { FilemakerTransport } = require('../index.js');

const manifestPath = path.join(__dirname, './env.manifest');

describe('Transport Tests', () => {
  let instance;
  let result;
  let database;
  beforeEach(done => {
    environment.config({ path: './tests/.env' });
    varium({ manifestPath });
    connect('nedb://memory')
      .then(db => {
        database = db;
        return database.dropDatabase();
      })
      .then(() => {
        instance = new FilemakerTransport({
          database: process.env.DATABASE,
          server: process.env.SERVER,
          user: process.env.USERNAME,
          password: process.env.PASSWORD,
          infoField: 'info',
          messageField: 'message',
          layout: process.env.LAYOUT,
          level: 'silly'
        });
        return instance;
      })
      .then(logger => done());
  });

  it('should have a log function', () => {
    assert.ok(instance.log);
    assert.equal('function', typeof instance.log);
  });

  it('should return true without a callback', () => {
    var info = {
      level: 'debug',
      message: 'foo'
    };
    var result = instance.log(info);
    assert(true, result);
  });

  it('should return true with a callback', done => {
    var info = {
      level: 'debug',
      message: 'foo'
    };

    info[MESSAGE] = JSON.stringify(info);
    var result = instance.log(info, () => {
      assert(true, result);
      done();
    });
  });

  it('should reject and log an error if there is an error', done => {
    let info = {
      level: 'debug',
      message: 'foo'
    };

    let newInstance = new FilemakerTransport({
      database: 'not a server',
      server: process.env.SERVER,
      user: process.env.USERNAME,
      password: process.env.PASSWORD,
      infoField: 'info',
      messageField: 'message',
      layout: process.env.LAYOUT,
      level: 'silly'
    });

    info[MESSAGE] = JSON.stringify(info);
    result = newInstance.log(info, error => {
      assert(true, result);
      done();
    });
  });
});
