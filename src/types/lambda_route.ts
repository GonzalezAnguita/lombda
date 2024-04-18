export type LambdaRouteT = {
    /** The lambda index file. Example: /authentication_service/login/dist/index.js */
    lambdaIndex: string;

    /** The name of the exported function, if ommited it will use default export */
    lambdaHandler?: string;

    /** The api path. Example: POST /auth/login */
    routeKey: string;

    authorizer?: {
        /** The lambda index file. Example: /authentication_service/login/dist/index.js */
        lambdaIndex: string;

        /** The name of the exported function, if ommited it will use default export */
        lambdaHandler?: string;
    }
};
