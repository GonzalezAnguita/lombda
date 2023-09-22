import {
    APIGatewayProxyEventV2,
    APIGatewayProxyResultV2,
} from 'aws-lambda';

export type LambdaHandlerT = (event: APIGatewayProxyEventV2) => Promise<APIGatewayProxyResultV2>;
