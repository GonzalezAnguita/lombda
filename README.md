# Lombda
This is a POC that lets you simulate an api gateway lambda proxy integration using an alternative server framework. For the moment only [Express.js](https://expressjs.com) is supported.

The library transforms the incoming request object to the payload that api gateway sends to the lambda when configured as Lambda Proxy Integration, more details can be found [here](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html#http-api-develop-integrations-lambda.v2). It also supports lambda authorizer.

### Setup
Lombda requires that you define the routes that your lambdas will be mapped to. To start you must install lombda package.

```bash
    npm i lombda
```

If you have environment variables
```bash
    npm i dotenv
```
and create an `.env` file with your variables

```javascript
// lombda.js

const dotenv = require('dotenv');
const Lombda = require('lombda').default;

dotenv.config();

Lombda.express([
    {
        lambdaIndex: 'path/to/public/lambda/dist/index.js',
        lambdaHandler: 'handler',
        routeKey: 'POST /public-lambda',
    },
    {
        lambdaIndex: 'path/to/authorized/lambda/index.js',
        lambdaHandler: 'handler',
        routeKey: 'GET /authorized-lambda',
        authorizer: {
            lambdaIndex: 'path/to/authorizer/dist/index.js',
            lambdaHandler: 'handler',
        },
    },
], {
    basePath: __dirname,
    port: 3002,
});
```

To run it just execute

```bash
    node lombda.js
```
