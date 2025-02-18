import { Request, Response } from 'express';

import { LambdaRouteT } from '../types/lambda_route';
import { parseEvent, parseAuthorizerEvent, parseAuthorizerEventWithContext } from './helpers/parse_event';
import { loadHandler } from '../lambda/handler_loader';
import { findRoute } from '../lambda/route_finder';
import { executeLambda } from '../lambda/execute_lambda';
import { populateParams } from '../lambda/params_populator';

export const adapter = (basePath: string, routes: LambdaRouteT[]) => {
    return async (req: Request, res: Response) => {
        const route = findRoute(routes, req);
        if (route === null) {
            res.status(404);
            res.send(`"${req.originalUrl}" not found`);

            return;
        }

        populateParams(route, req);

        const proxyEvent = parseEvent(route, req);

        let event: any = proxyEvent;

        if (route.authorizer?.lambdaIndex && route.authorizer?.lambdaHandler) {
            const authorizerEvent = parseAuthorizerEvent(route, req);

            const authorizer = await loadHandler(basePath, route.authorizer.lambdaIndex, route.authorizer.lambdaHandler);
            if (authorizer === null) {
                res.status(500);
                res.send(`Internal server error loading authorizer routeKey "${route.routeKey}"`);
    
                return;
            }
            
            const response = await executeLambda(authorizerEvent, authorizer);
            if (typeof response.body !== 'string') {
                res.status(500);
                res.send('Lombda: Internal server error authorizer response body is not a string');
    
                return;
            }

            const body = JSON.parse(response.body);
            if (!body.isAuthorized) {
                res.status(401);
                res.send('Unauthorized');
    
                return;
            }

            event = parseAuthorizerEventWithContext(proxyEvent, body.context);
        }

        const handler = await loadHandler(basePath, route.lambdaIndex, route.lambdaHandler);
        if (handler === null) {
            res.status(500);
            res.send(`Internal server error loading handler for routeKey "${route.routeKey}"`);

            return;
        }

        const response = await executeLambda(event, handler);

        Object.entries(response.headers ?? {}).forEach(([key, value]) => {
            res.setHeader(key, String(value));
        });

        if (response.cookies) {
            res.setHeader('Set-Cookie', response.cookies);
        }

        res.status(response.statusCode ?? 200);
        res.send(response.body);
    }
}