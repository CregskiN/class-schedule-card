import Koa from 'koa';
import parser from 'koa-bodyparser';
import koaStatic from 'koa-static';
import path from 'path';

import config from './config';
import catchError from './src/middlewares/catchError';
import { InitSignManager } from './src/core/init';

const app = new Koa();


app.use(catchError());
app.use(koaStatic(
    path.resolve(__dirname, './static'))
);
app.use(parser());
InitSignManager.initCore(app);

app.listen(config.server.port, () => {
    console.log(`yiban signin running on prot ${config.server.port}`)
})