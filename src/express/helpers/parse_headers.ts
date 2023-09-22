import {
    APIGatewayProxyEventHeaders,
    APIGatewayProxyEventQueryStringParameters,
} from 'aws-lambda';
import { Request } from 'express';

export const parseHeaders = (req: Request): APIGatewayProxyEventHeaders => {
    const headers: APIGatewayProxyEventQueryStringParameters = {};

    Object.entries(req.headers).forEach(([key, value]) => {
        headers[key] = String(value);
    })

    return headers;
}