import {
    APIGatewayProxyEventV2,
    APIGatewayRequestAuthorizerEventV2,
    APIGatewayProxyEventV2WithLambdaAuthorizer,
} from 'aws-lambda';
import { Request } from 'express';
import { LambdaRouteT } from '../../types/lambda_route';

import { parseHeaders } from './parse_headers';
import { parseQueryParams } from './parse_query';

/**
 * Based on the official documentation map express event into lambda integration event
 * https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html#http-api-develop-integrations-lambda.v2
 * 
 * @param req
 * @returns 
 */
export const parseEvent = (route: LambdaRouteT, req: Request): APIGatewayProxyEventV2 => {
    const [baseUrl, queryParams] = req.originalUrl.split('?');

    let body = undefined;
    if (Object.keys(req.body).length) {
        body = req.body;
    }

    // Express uses path parameters as :paramName but API Gateway uses {paramName}
    const routeKeyWithParamsParts = route.routeKey.replace(/\/:([^\/]+)(?:|$)/g, '/{$1}');

    return {
        version: '2.0',
        routeKey: routeKeyWithParamsParts,
        rawPath: baseUrl,
        rawQueryString: queryParams,
        pathParameters: req.params,
        headers: parseHeaders(req),
        queryStringParameters: parseQueryParams(req),
        cookies: req.cookies,
        requestContext: {
            accountId: '',
            apiId: '',
            domainName: '',
            domainPrefix: '',
            http: {
                method: req.method,
                path: baseUrl,
                protocol: `${req.protocol.toUpperCase()}/${req.httpVersion}`,
                sourceIp: req.socket.remoteAddress ?? '',
                userAgent: req.headers['user-agent'] ?? '',
            },
            requestId: '',
            routeKey: '',
            stage: '',
            time: new Date().toISOString(),
            timeEpoch: new Date().getTime(),
        },
        body,
        isBase64Encoded: false
    };
}

export const parseAuthorizerEvent = (req: Request): APIGatewayRequestAuthorizerEventV2 => {
    const [baseUrl, queryParams] = req.originalUrl.split('?');
    const method = req.method;

    let body = undefined;
    if (Object.keys(req.body).length) {
        body = req.body;
    }

    const identitySource: string[] = [];
    if (req.headers['authorization']) {
        identitySource.push(req.headers['authorization']);
    }

    return {
        type: 'REQUEST',
        routeArn: '',
        identitySource,

        version: '2.0',
        routeKey: `${method} ${baseUrl}`,
        rawPath: baseUrl,
        rawQueryString: queryParams,
        headers: parseHeaders(req),
        queryStringParameters: parseQueryParams(req),
        cookies: req.cookies,
        requestContext: {
            accountId: '',
            apiId: '',
            domainName: '',
            domainPrefix: '',
            http: {
                method: req.method,
                path: baseUrl,
                protocol: `${req.protocol.toUpperCase()}/${req.httpVersion}`,
                sourceIp: req.socket.remoteAddress ?? '',
                userAgent: req.headers['user-agent'] ?? '',
            },
            requestId: '',
            routeKey: '',
            stage: '',
            time: new Date().toISOString(),
            timeEpoch: new Date().getTime(),
        },
    };
}

export const parseAuthorizerEventWithContext = <T extends unknown>(
    event: APIGatewayProxyEventV2,
    context: T
): APIGatewayProxyEventV2WithLambdaAuthorizer<T> => {
    return {
        ...event,
        requestContext: {
            ...event.requestContext,
            authorizer: {
                lambda: context,
            }
        },
    };
}
