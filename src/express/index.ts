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
    const { basePath, port, cors } = config;
    const app = express();

    const router = adapter(basePath, routes);

    app.use(bodyParser.text({ type: '*/*' }));

    if (cors) {
        app.use((_, res, next) => {
            Object.entries(cors).forEach(([key, value]) => {
                res.append(key, value);
            });

            next();
        });

        app.options('*', (_, res) => {
            res.status(200);
            res.send();
        });
    }

    app.use('*', router);

    app.listen(port, () => {
        console.log(`[server]: Lombda is running at http://localhost:${port}`);
    });
}
