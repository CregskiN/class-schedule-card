import { Context } from 'koa';
import Router from 'koa-router';

const router = new Router();
router.prefix('/api/v1/curriculum');

/**
 *
 */
router.post('/get', async (ctx: Context) => {
    console.log(ctx.request)
});

export default router;
