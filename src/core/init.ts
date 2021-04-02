import Koa from 'koa';

import yibanRouter from '../api/v1/sign';
import manageRouter from '../api/v1/curriculum';
// import YibanManager from '../services/yiban';
// import Storage from '../util/storage';

/**
 * 初始化签到系统
 */
export class InitSignManager {
    public static app: Koa;

    static initCore(app: Koa) {
        InitSignManager.app = app;
        InitSignManager.initLoadRouter();
        // InitSignManager.initShadule();
    }

    /**
     * 批量导入、注册路由
     */
    static initLoadRouter() {
        InitSignManager.app.use(yibanRouter.routes());
        InitSignManager.app.use(manageRouter.routes());
    }

    // /**
    //  * 初始化 将已有用户加入签到计时任务
    //  */
    // static async initShadule() {
    //     const y = YibanManager.getInstance();
    //     const usersData = Storage.getUsers();
    //     for (let key in usersData) {
    //         await y.shadule(usersData[key]);
    //     }
    // }

}

/**
 * 初始化用户数据管理系统
 */
export class InitManageManager {
    public static app: Koa;

    static initCore(app: Koa) {
        InitManageManager.app = app;
        InitManageManager.initLoadRouter();
    }

    /**
     * 批量导入、注册路由
     */
    static initLoadRouter() {
        // InitManageManager.app.use(userRouter.routes());
        InitManageManager.app.use(manageRouter.routes());
    }

    /**
     * 启动定时任务，内部实现为把用户数据移动到另外的json文件
     */
    static initShedule() {

    }

}
