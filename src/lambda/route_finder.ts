import { Request } from 'express';
import { LambdaRouteT } from '../types/lambda_route';

export const findRoute = (routes: LambdaRouteT[], req: Request): LambdaRouteT | null => {
    const [path] = req.originalUrl.split('?');
    const method = req.method;

    const route = routes.find(route => route.routeKey === `${method} ${path}`);
    if (route === undefined) return null;

    return route;
}
