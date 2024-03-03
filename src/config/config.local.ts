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
    },
    // grpc
    grpcServer: {
      // 定义grpc的请求地址和端口
      url: "192.168.1.3:7701"
    },
    // consul
    consul: {
      service: {
        // 此处是当前这个 midway 应用的地址
        address: "192.168.1.3",
        // 当前 midway 应用的端口
        port: 7001,
        // 名称
        name: "midway-demo"
        // others consul service definition
      }
    }
  };
}
