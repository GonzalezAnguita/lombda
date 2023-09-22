# Lombda
This is a POC that lets you simulate an api gateway lambda proxy integration using an alternative server framework. For the moment only [Express.js](https://expressjs.com) is supported.

The library transforms the incoming request object to the payload that api gateway sends to the lambda when configured as Lambda Proxy Integration, more details can be found [here](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html#http-api-develop-integrations-lambda.v2)

### Example
There is an `example` project that you can run to get started. The source index you define which server you want to use to accept incoming requests

```javascript
// src/index.ts

import dotenv from 'dotenv';
import Lombda from 'lombda';

dotenv.config();

Lombda.express(__dirname);
```

Any other directory that you create under src will create an endpoint that once called it will trigger your lambda. The below lambda will be available under `localhost/my_lambda`

```typescript
// src/my_lambda/index.ts

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    return {
        statusCode: 200,
        body: JSON.stringify(event),
    };
};

```
