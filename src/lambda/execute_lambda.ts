import {
    APIGatewayProxyStructuredResultV2,
    APIGatewaySimpleAuthorizerWithContextResult,
} from 'aws-lambda';

import { hasProperty } from '../helpers/property_assertion';
import { LambdaHandlerT } from '../types/lambda_handler';

export const executeLambda = async (event: any, lambdaHandler: LambdaHandlerT): Promise<APIGatewayProxyStructuredResultV2> => {
    const lambdaResponse = await lambdaHandler(event);

    let baseResponse: APIGatewayProxyStructuredResultV2 = {
        isBase64Encoded: false,
        statusCode: 200,
        body: '',
        headers: {
          "content-type": "application/json"
        },
    };
    
    if (typeof lambdaResponse === 'string') {
        baseResponse.body = lambdaResponse;
    } else if (!hasProperty('statusCode', lambdaResponse)) {
        baseResponse.body = JSON.stringify(lambdaResponse);
    } else {
        baseResponse = {
            ...baseResponse,
            ...lambdaResponse,
        };
    }

    return baseResponse;
}

export const executeSimpleLambdaAuthorizer = async (event: any, lambdaHandler: LambdaHandlerT): Promise<APIGatewaySimpleAuthorizerWithContextResult<unknown>> => {
    return executeLambda(event, lambdaHandler) as unknown as APIGatewaySimpleAuthorizerWithContextResult<unknown>;
}
