import express from 'express';
import bodyParser from 'body-parser';

import { adapter } from './adapter';
import { LambdaRouteT } from '../types/lambda_route';

export const ExpressLombda = (routes: LambdaRouteT[], config: { basePath: string, port: number }) => {
    const app = express();

    const router = adapter(config.basePath, routes);

    app.use(bodyParser.text({ type: '*/*' }));

    app.use('*', router);
    
    app.listen(config.port, () => {
      console.log(`[server]: Lombda is running at http://localhost:${config.port}`);
    });
}
