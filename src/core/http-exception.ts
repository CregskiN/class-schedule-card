/**
 * 基类
 */
export class HttpException extends Error {
    public msg: string;
    public errorCode: Yiban.ErrorCode;
    public statusCode: Yiban.StatusCode;
    constructor(msg?: string, errorCode?: Yiban.ErrorCode, statusCode?: Yiban.StatusCode) {
        super();
        this.msg = msg || '预料之内的错误';
        this.errorCode = errorCode || 10000;
        this.statusCode = statusCode || 400;
    }
}

/**
 * 参数性错误
 */
export class ParameterException extends HttpException {
    constructor(msg?: string, errorCode?: Yiban.ErrorCode) {
        super();
        this.msg = msg || '输入的参数有误';
        this.errorCode = errorCode || 10001;
        this.statusCode = 401;
    }
}

/**
 * 提交到易班服务器时发生错误
 */
export class SignupException extends HttpException {
    constructor(msg?: string, errorCode?: Yiban.ErrorCode) {
        super();
        this.msg = msg || '提交到易班服务器时发生错误';
        this.errorCode = errorCode || 40001;
        this.statusCode = 400;
    }
}

/**
 * 发送邮件时发生错误
 */
export class EmailException extends HttpException {
    constructor(msg?: string, errorCode?: Yiban.ErrorCode) {
        super();
        this.msg = msg || '发送邮件时发生错误';
        this.errorCode = errorCode || 40002;
        this.statusCode = 401;
    }
}

export class Success extends HttpException{
    constructor(msg?: string, errorCode?: Yiban.ErrorCode) {
        super();
        this.msg = msg || '提交成功';
        this.errorCode = errorCode || 0;
        this.statusCode = 200;
    }
}

/**
 * 签到时间已过
 */
export class TimeoutException extends HttpException{
    constructor(msg?: string, errorCode?: Yiban.ErrorCode) {
        super();
        this.msg = msg || '签到时间已过';
        this.errorCode = errorCode || 40003;
        this.statusCode = 400;
    }
}