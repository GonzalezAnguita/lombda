import { Request, Response } from 'express';

import { parseEvent } from './helpers/parse_event';
import { loadConfig } from '../lambda/config_loader';
import { loadHandler } from '../lambda/handler_loader';
import { executeLambda } from '../lambda/execute_lambda';

export const adapter = (basePath: string) => {
    return async (req: Request, res: Response) => {
        const event = parseEvent(req);

        const config = await loadConfig(basePath, req);
        if (config !== null && !String(config.allowed_methods).includes(req.method)) {
            res.status(404);
            res.send(`"${req.originalUrl}" not found`);

            return;
        }

        const handler = await loadHandler(basePath, req);

        if (handler === null) {
            res.status(404);
            res.send(`"${req.originalUrl}" not found`);

            return;
        }

        const response = await executeLambda(event, handler);

        Object.entries(response.headers ?? {}).forEach(([key, value]) => {
            res.setHeader(key, String(value));
        });

        res.status(response.statusCode ?? 200);
        res.send(response.body);
    }
}