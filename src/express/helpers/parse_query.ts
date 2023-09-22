import {
    APIGatewayProxyEventQueryStringParameters,
} from 'aws-lambda';
import { Request } from 'express';

export const parseQueryParams = (req: Request): APIGatewayProxyEventQueryStringParameters => {
    const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {};

    Object.entries(req.query).forEach(([key, value]) => {
        queryStringParameters[key] = String(value);
    })

    return queryStringParameters;
}
