import Koa from 'koa';

import curriculum from '../api/v1/curriculum';

/**
 * 初始化签到系统
 */
export class InitManager {
    public static app: Koa;

    static initCore(app: Koa) {
        InitManager.app = app;
        InitManager.initLoadRouter();
    }

    /**
     * 批量导入、注册路由
     */
    static initLoadRouter() {
        InitManager.app.use(curriculum.routes());
    }
}
