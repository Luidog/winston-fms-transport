'use strict';
/* global describe beforeEach it */

/* eslint-disable */

const assert = require('assert');
const { expect, should } = require('chai');
const chai = require('chai');

/* eslint-enable */

const environment = require('dotenv');
const varium = require('varium');
const MESSAGE = Symbol.for('message');
const { connect } = require('marpat');
const { FilemakerTransport } = require('../index.js');

environment.config({ path: './tests/.env' });
varium(process.env, './tests/env.manifest');

describe('.log()', () => {
  let instance, database;
  beforeEach(done => {
    connect('nedb://memory')
      .then(db => {
        database = db;
        return database.dropDatabase();
      })
      .then(() => {
        instance = new FilemakerTransport({});
        return done();
      });
  });
  it('should be present', () => {
    assert.ok(instance.log);
    assert.equal('function', typeof instance.log);
  });

  it('should return true without a callback', () => {
    var info = {
      level: 'debug',
      message: 'foo'
    };

    info[MESSAGE] = JSON.stringify(info);
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
});
