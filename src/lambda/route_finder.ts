import { Request } from 'express';
import { LambdaRouteT } from '../types/lambda_route';

export const findRoute = (routes: LambdaRouteT[], req: Request): LambdaRouteT | null => {
    const [requestPath] = req.originalUrl.split('?');
    const requestMethod = req.method;

    const exactRoute = routes.find(route => {
        const [routeMethod, routePath] = route.routeKey.split(' ');

        return routeMethod === requestMethod && routePath === requestPath;
    });

    if (exactRoute !== undefined) return exactRoute;

    const partialRoute = routes.find(route => {
        const [routeMethod, routePath] = route.routeKey.split(' ');
        if (routeMethod !== requestMethod) return false;

        if (routePath === requestPath) return true;

        const routePathParts = routePath.split('/');
        const requestPathParts = requestPath.split('/');

        const isMatch = routePathParts.every((routePart, index) => {
            if (requestPathParts.length <= index) return false;

            const requestPart = requestPathParts[index];

            return routePart.startsWith(':') || routePart === requestPart;
        });

        return isMatch;
    });

    if (partialRoute === undefined) return null;

    return partialRoute;
}
