import {
    APIGatewayProxyEventV2,
} from 'aws-lambda';
import { Request } from 'express';

import { parseHeaders } from './parse_headers';
import { parseQueryParams } from './parse_query';

/**
 * Based on the official documentation map express event into lambda integration event
 * https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html#http-api-develop-integrations-lambda.v2
 * 
 * @param req
 * @returns 
 */
export const parseEvent = (req: Request): APIGatewayProxyEventV2 => {
    const [baseUrl, queryParams] = req.originalUrl.split('?');

    let body = undefined;
    if (Object.keys(req.body).length) {
        body = req.body;
    }

    return {
        version: '2.0',
        routeKey: '$default',
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
            timeEpoch: new Date().getTime()
        },
        body,
        isBase64Encoded: false
    };
}