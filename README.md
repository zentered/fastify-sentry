# Fastify Sentry Plugin using the Sentry SDK

[![Test](https://github.com/zentered/fastify-sentry/actions/workflows/test.yml/badge.svg)](https://github.com/zentered/fastify-sentry/actions/workflows/test.yml)
[![Semantic Release](https://github.com/zentered/fastify-sentry/actions/workflows/publish.yml/badge.svg)](https://github.com/zentered/fastify-sentry/actions/workflows/publish.yml)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

> [!WARNING]
> **This package is deprecated.** Use the Sentry SDK's built-in Fastify support instead: [`fastifyIntegration`](https://docs.sentry.io/platforms/javascript/guides/fastify/) from `@sentry/node`.
> This plugin calls `Sentry.startTransaction`, `Sentry.Integrations.Http` and `@sentry/tracing`. Sentry removed all three in v8.
>
> Migrate:
>
> ```bash
> npm uninstall @zentered/fastify-sentry
> npm install @sentry/node
> ```
>
> For `@sentry/node` v11:
>
> ```js
> // instrument.js - load it first: node --import ./instrument.js app.js
> const Sentry = require('@sentry/node')
>
> Sentry.init({
>   dsn: process.env.SENTRY_DSN,
>   environment: 'development',
>   tracesSampleRate: 1.0,
>   integrations: [
>     Sentry.fastifyIntegration({
>       // replaces errorFilter
>       shouldHandleError: (error, request, reply) => reply.statusCode >= 500
>     })
>   ]
> })
> ```
>
> Remove the `app.register(fastifySentry, ...)` call.
>
> On `@sentry/node` v8, `fastifyIntegration()` takes no options, so `shouldHandleError` has no effect. Use `integrations: [Sentry.fastifyIntegration()]` and call `Sentry.setupFastifyErrorHandler(app)` after creating the app, or no Fastify errors are captured. See the [Sentry Fastify guide](https://docs.sentry.io/platforms/javascript/guides/fastify/) and the [v7 to v8 migration guide](https://docs.sentry.io/platforms/javascript/guides/node/migration/v7-to-v8/).

## Installation

```bash
npm i @zentered/fastify-sentry

or

yarn add @zentered/fastify-sentry
```

## Usage

```js
const fastifySentry = require('@zentered/fastify-sentry')

const errorHandler = (err, req, reply) => {
  reply.status(req.body.error).send({
    message: req.body.message,
    e: err.message
  })
}

app.register(fastifySentry, {
  dsn: process.env.SENTRY_DSN,
  environment: 'development',
  tracing: true,
  tracesSampleRate: 1.0,
  errorHandler
})

fastify.get('/', async (request, reply) => {
  // Errors in async functions are automatically caught
  throw new Error('Oops')
})
```

## Description

This plugin adds the Sentry SDK error handler by using `setErrorHandler`. It also adds certain metadata, namely the `path` and the `ip` parameters of the request, to both the `User` context and `Tag` context of Sentry. If you use jwt authentication, the user id is also added to Sentry.

## Options

| Option         | Required | Description                                               |
| -------------- | -------- | --------------------------------------------------------- |
| `dsn`          | required | The DSN specified by Sentry.io to properly log errors to. |
| `tracing`      | optional | Default `false`, enable Sentry tracing.                   |
| `errorHandler` | optional | Custom error handler for errors.                          |
| `errorFilter`  | optional | Error filter to selectively disable Sentry reporting.     |

You can find further options in the [Node.js Guide on Sentry.io](https://docs.sentry.io/platforms/node/)

## Author

[Alex Papageorgiou](alex.ppg@pm.me)

## License

Licensed under [GPLv3](./LICENSE).
