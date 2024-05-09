'use strict'

/* eslint-disable node/no-unpublished-require */
const Fastify = require('fastify')
const tap = require('tap')
const sinon = require('sinon')
const fastifySentry = require('../index')

/**
 * TestIntegration class .
 * @implements {import("@sentry/types").Integration}
 */
class TestIntegration {
  constructor() {
    this.name = "TestIntegration"
    this.setupOnce = sinon.spy();
  }
} 

tap.test('adding more integrations', async (test) => {
  test.teardown(() => fastify.close())

  const testIntegration = new TestIntegration()

  const fastify = Fastify()
  fastify.register(fastifySentry, {
    dsn: 'https://00000000000000000000000000000000@sentry.io/0000000',
    integrations: [testIntegration]
  })

  await fastify.ready()
  test.ok(testIntegration.setupOnce.called, 'setupOnce should have been called')
})
