export default {
    server: {
        port: 8100,
        baseUrl: 'http://www.cregskin.com',
        // baseUrl: 'http://www.localhost.com:8100',
        staticPath: '/yiban-signin/static'
        // staticPath: '/static'
    },

    manager: {
        email: '1396065465@qq.com'
    },

    mailbaseConfig: {
        host: "smtp.qq.com", // 主机，各服务商的主机地址不同，比如qq的是smtp.qq.com
        // secure: false, // 使用 SSL
        // secureConnection: false, // 使用 SSL
        port: 465, // 网易的SMTP端口，各个服务商端口号不同，比如qq的是465
        auth: {
            user: "1396065465@qq.com", // 账号
            pass: 'lenlasdyjuwzbabb'
        }
    }
}