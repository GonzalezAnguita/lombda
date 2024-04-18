import { join } from 'path';

import { LambdaHandlerT } from '../types/lambda_handler';

export const loadHandler = async (basePath: string, lambdaIndex: string, lambdaHandler?: string): Promise<LambdaHandlerT | null> => {
    try {
        const sanitizedPath = join(basePath, lambdaIndex);

        if (lambdaHandler) {
            return new Promise((resolve, reject) => {
                return resolve(require(sanitizedPath)[lambdaHandler]);
            });
        }

        return new Promise((resolve, reject) => {
            return resolve(require(sanitizedPath).default);
        });
    } catch (error) {
        console.error('Lombda: Error loading handler');
        console.error(error);
        return null;
    }
}
