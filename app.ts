import Koa from 'koa';
import parser from 'koa-bodyparser';
import koaStatic from 'koa-static';
import path from 'path';

import config from './config';
import catchError from './src/middlewares/catchError';
import { InitManager } from './src/core/init';

const app = new Koa();

// 中间件：错误捕获
app.use(catchError());

// 静态资源：将 / 映射到 ./public
app.use(koaStatic(
    path.resolve(__dirname, './public'))
);

// 中间件：解析request
app.use(parser());

// 初始化
InitManager.initCore(app);

app.listen(config.server.port, () => {
    console.log(`yiban signin running on prot ${config.server.port}`)
})