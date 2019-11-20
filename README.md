[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Build Status](https://travis-ci.org/shekhar-raval/node-express-es8.svg?branch=master)](https://travis-ci.org/shekhar-raval/node-express-es8)
[![Coverage Status](https://coveralls.io/repos/github/shekhar-raval/node-express-es8/badge.svg?branch=master)](https://coveralls.io/github/shekhar-raval/node-express-es8?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/shekhar-raval/node-express-es8/badge.svg?targetFile=package.json)](https://snyk.io/test/github/shekhar-raval/node-express-es8?targetFile=package.json)
![node version](https://img.shields.io/badge/node-%3E=%2012.0.0-brightgreen.svg)
[![express](https://img.shields.io/badge/express-4.17.1-orange.svg)](https://github.com/expressjs/express)
[![mongoose](https://img.shields.io/badge/mongoose-5.7.7-red.svg)](https://mongoosejs.com/)
[![jsonwebtoken](https://img.shields.io/badge/jsonwebtoken-8.5.1-green.svg)](https://github.com/auth0/node-jsonwebtoken)
[![LICENCE](https://img.shields.io/github/license/shekhar-raval/node-express-es8)](https://img.shields.io/github/license/shekhar-raval/node-express-es8)
[![code style](https://img.shields.io/badge/eslint--config--standard-%5E12.0.0-blue.svg)](https://github.com/standard/eslint-config-standard)
![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen.svg)

# Node.js - Express, MongoDB, ES8 REST API Boilerplate

## Features

- Uses [npm](https://npmjs.com)
- No transpilers, just vanilla javascript with ES2018 latest features like Async/Await
- Express + MongoDB ([Mongoose](http://mongoosejs.com/))
- CORS enabled and uses [helmet](https://github.com/helmetjs/helmet) to set some HTTP headers for security
- Load environment variables from .env files with [dotenv](https://github.com/rolodato/dotenv-safe)
- Request validation with [joi](https://github.com/hapijs/joi)
- Logging with winston [winston](https://github.com/winstonjs/winston)
- File upload with [multer](https://www.npmjs.com/package/multer)
- Consistent coding styles with [editorconfig](http://editorconfig.org)
- Gzip compression with [compression](https://github.com/expressjs/compression)
- Linting with [eslint](http://eslint.org)
- Tests with [mocha](https://mochajs.org), [chai](http://chaijs.com) and [sinon](http://sinonjs.org)
- Code coverage with [istanbul](https://istanbul.js.org) and [coveralls](https://coveralls.io)
- Git hooks with [husky](https://github.com/typicode/husky)
- Logging with [morgan](https://github.com/expressjs/morgan)
- Authentication and Authorization with [passport](http://passportjs.org)
- Rate limiting with [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)
- API documentation generation with [Apidoc](http://apidocjs.com)
- [Docker](https://www.docker.com/) support
- Monitoring with [pm2](https://github.com/Unitech/pm2)

> Take a demo at Link Soon Coming...

## Prerequisites

- [Node v10.0+](https://nodejs.org/en/download/current/) or [Docker](https://www.docker.com/)

- [npm v6.0+](https://www.npmjs.com)

## Getting Started

1. Clone the repo and make it yours:

```bash
git clone https://github.com/shekhar-raval/node-express-es8 node-api
cd node-api
rm -rf .git
```

2. Install dependencies:

```bash
npm install
```

3. Set environment variables:

```bash
cp .env.example .env
```

## Running Locally

```bash
npm run dev
```

## Running in Production

```bash
npm run start
```

## Lint

```bash
# lint code with ESLint
npm run lint

# try to fix ESLint errors
npm run lint:fix

# lint and watch for changes
npm run lint:watch
```

## Test

```bash
# run all tests with Mocha
npm run test

# run unit tests
npm run test:unit

# run integration tests
npm run test:integration

# run all tests and watch for changes
npm run test:watch

# open nyc test coverage reports
npm run coverage
```

## Validate

```bash
# run lint and tests
npm run validate
```

## Documentation

```bash
# generate and open api documentation
npm run docs
```

## Docker

```bash
# run container in production
npm run docker:prod
or
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

# run tests
npm run docker:test
or
docker-compose -f docker-compose.yml -f docker-compose.test.yml up
```

## Rate Limit Configuration

Change configuration in `.env` file
