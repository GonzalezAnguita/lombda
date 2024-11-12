import express from 'express';
import bodyParser from 'body-parser';

import { adapter } from './adapter';
import { LambdaRouteT } from '../types/lambda_route';

type CorsHeadersT = {
    'Access-Control-Allow-Origin': string,
    'Access-Control-Allow-Headers': string,
    'Access-Control-Allow-Methods': string,
}

export const ExpressLombda = (
    routes: LambdaRouteT[],
    config: {
        basePath: string,
        port: number,
        cors?: CorsHeadersT,
    },
) => {
    const app = express();

    const router = adapter(config.basePath, routes);

    app.use(bodyParser.text({ type: '*/*' }));

    app.use('*', router);

    app.use((_, res, next) => {
        if (config.cors) {
            Object.entries(config.cors).forEach(([key, value]) => {
                res.append(key, value);
            });
        }

        next();
    });

    app.listen(config.port, () => {
        console.log(`[server]: Lombda is running at http://localhost:${config.port}`);
    });
}
