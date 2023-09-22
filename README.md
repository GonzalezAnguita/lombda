# Lombda
## Run lambdas locally


```javascript
// src/index.ts

import dotenv from 'dotenv';
import Lombda from 'lombda';

dotenv.config();

Lombda.express(__dirname);
```

Then create a lambda function

```typescript
// src/v1/my_lambda/index.ts

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    return {
        statusCode: 200,
        body: JSON.stringify(event),
    };
};

```

the above will be available under localhost/v1/my_lambda