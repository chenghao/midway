import { MidwayAppInfo, MidwayConfig } from "@midwayjs/core";

export default (appInfo: MidwayAppInfo): MidwayConfig => {
  return {
    koa: {
      port: 7001
    },
    // 日志
    midwayLogger: {
      default: {
        level: "debug"
      }
    },
    // 数据库
    typeorm: {
      dataSource: {
        // 自定义数据源名称
        testDataSource: {
          logging: true // 启用失败查询的日志记录
        }
        // 更多的数据源配置
      }
    }
  };
}
