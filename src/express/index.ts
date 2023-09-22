import express from 'express';
import bodyParser from 'body-parser';

import { adapter } from './adapter';

export const ExpressLombda = (basePath: string) => {
    const app = express();
    
    const { PORT } = process.env;

    const router = adapter(basePath);

    app.use(bodyParser.text({ type: '*/*' }));

    app.use('*', router);
    
    app.listen(PORT, () => {
      console.log(`[server]: Lombda is running at http://localhost:${PORT}`);
    });
}
