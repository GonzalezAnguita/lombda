import { Request } from 'express';
import { LambdaRouteT } from '../types/lambda_route';

export const findRoute = (routes: LambdaRouteT[], req: Request): LambdaRouteT | null => {
    const [requestPath] = req.originalUrl.split('?');
    const requestMethod = req.method;

    const route = routes.find(route => {
        const [routeMethod, routePath] = route.routeKey.split(' ');
        if (routeMethod !== requestMethod) return false;

        const routePathParts = routePath.split('/');
        const requestPathParts = requestPath.split('/');

        const isMatch = routePathParts.every((routePart, index) => {
            if (requestPathParts.length <= index) return false;

            const requestPart = requestPathParts[index];

            return routePart.startsWith(':') || routePart === requestPart;
        });

        return isMatch;
    });
    if (route === undefined) return null;

    return route;
}
