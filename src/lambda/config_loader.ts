import { join } from 'path';
import { Request } from 'express';

export const loadConfig = async (basePath: string, req: Request): Promise<Record<string, unknown> | null> => {
    const [path] = req.originalUrl.split('?');

    try {
        if (/^(\.*\/)*$/.test(path)) {
            throw new Error();
        }

        const sanitizedPath = join(basePath, path, 'config.json');

        const json = await require(sanitizedPath);
    
        return json;
    } catch {
        console.log(`Config "${path}" not found, ignoring...`);
        return null;
    }
}
