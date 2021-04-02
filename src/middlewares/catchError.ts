import { Context, Next } from 'koa';
import { HttpException } from '../core/http-exception';

export default () => {
    return async (ctx: Context, next: Next) => {
        try {
            await next();
        } catch (error) {
            const isHttpException = error instanceof HttpException;
            // console.log('isHttpExcetion', isHttpException);

            if (isHttpException) {
                // 预料之内的反馈
                ctx.body = {
                    msg: error.msg,
                    errorCode: error.errorCode,
                    requestUrl: `${ctx.method} ${ctx.path}`,
                }
                ctx.status = error.statusCode;
            } else {
                console.error(`发生意料之外的错误 ${new Date()}`, error);
                // 预料之外的错误 500
                ctx.body = {
                    msg: 'we made a mistake, plase send a e-mail to 272473132@qq.com. 😄',
                    errorCode: 999,
                    requestUrl: `${ctx.method} ${ctx.path}`
                }
                ctx.status = 500;

            }
        }
    }
}