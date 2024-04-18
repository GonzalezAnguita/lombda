import { Request, Response } from 'express';

import { LambdaRouteT } from '../types/lambda_route';
import { parseEvent, parseAuthorizerEvent, parseAuthorizerEventWithContext } from './helpers/parse_event';
import { loadHandler } from '../lambda/handler_loader';
import { findRoute } from '../lambda/route_finder';
import { executeLambda, executeSimpleLambdaAuthorizer } from '../lambda/execute_lambda';

export const adapter = (basePath: string, routes: LambdaRouteT[]) => {
    return async (req: Request, res: Response) => {
        const route = findRoute(routes, req);
        if (route === null) {
            res.status(404);
            res.send(`"${req.originalUrl}" not found`);

            return;
        }

        const proxyEvent = parseEvent(req);
        if (proxyEvent.routeKey !== route.routeKey) {
            res.status(500);
            res.send(`Internal server error routeKey mismatch "${proxyEvent.routeKey}" !== "${route.routeKey}"`);

            return;
        }

        let event: any = proxyEvent;

        if (route.authorizer?.lambdaIndex && route.authorizer?.lambdaHandler) {
            const authorizerEvent = parseAuthorizerEvent(req);

            const authorizer = await loadHandler(basePath, route.authorizer.lambdaIndex, route.authorizer.lambdaHandler);
            if (authorizer === null) {
                res.status(500);
                res.send(`Internal server error loading authorizer routeKey "${route.routeKey}"`);
    
                return;
            }
            
            const response = await executeSimpleLambdaAuthorizer(authorizerEvent, authorizer);
            if (response.isAuthorized === false) {
                res.status(401);
                res.send(`Unauthorized`);
    
                return;
            }

            event = parseAuthorizerEventWithContext(proxyEvent, response.context);
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

        res.status(response.statusCode ?? 200);
        res.send(response.body);
    }
}