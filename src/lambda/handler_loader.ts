import { join } from 'path';
import { Request } from 'express';

import { LambdaHandlerT } from '../types/lambda_handler';

export const loadHandler = async (basePath: string, req: Request): Promise<LambdaHandlerT | null> => {
    const [path] = req.originalUrl.split('?');

    try {
        if (/^(\.*\/)*$/.test(path)) {
            throw new Error();
        }

        const sanitizedPath = join(basePath, path, 'index.js');

        const { handler } = await require(sanitizedPath);
    
        return handler as LambdaHandlerT;
    } catch {
        console.log(`Module "${path}" not found, ignoring...`);
        return null;
    }
}
