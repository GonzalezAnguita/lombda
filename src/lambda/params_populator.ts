import { Request } from 'express';
import { LambdaRouteT } from '../types/lambda_route';

export const populateParams = (route: LambdaRouteT, req: Request): Request => {
    const [requestPath] = req.originalUrl.split('?');

    const requestPathParts = requestPath.split('/');
    const routePathParts = route.routeKey.split('/');

    req.params = {};

    routePathParts.forEach((routePart, index) => {
        if (routePart.startsWith(':')) {
            req.params[routePart.slice(1)] = requestPathParts[index];
        }
    });

    return req;
}