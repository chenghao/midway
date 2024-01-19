import { MidwayAppInfo, MidwayConfig } from "@midwayjs/core";
import { join } from "path";


export default (appInfo: MidwayAppInfo): MidwayConfig => {
  return {
    keys: "1705388071665_1649",
    koa: {
      port: 7001,
      //自定义配置上下文日志
      contextLoggerFormat: info => {
        const ctx = info.ctx;
        return `${info.timestamp} ${info.LEVEL} [${ctx.ip}] [${ctx.path} ${ctx.method}] ${Date.now() - ctx.startTime}ms -- ${info.message}`;
      }
    },
    // 跨域配置
    cors: {
      // 设置 Access-Control-Allow-Methods 的值
      // 允许跨域的方法，【默认值】为 GET,HEAD,PUT,POST,DELETE,PATCH
      allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
      // 设置 Access-Control-Allow-Origin 的值，【默认值】会获取请求头上的 origin
      // 也可以配置为一个回调方法，传入的参数为 request，需要返回 origin 值
      // 如果设置了 credentials，则 origin 不能设置为 *
      origin: "*",
      // 设置 Access-Control-Allow-Headers 的值，【默认值】会获取请求头上的 Access-Control-Request-Headers
      allowHeaders: "*",
      // 设置 Access-Control-Allow-Credentials，【默认值】false
      // 也可以配置为一个回调方法，传入的参数为 request，返回值为 true 或 false
      credentials: false,
      // 设置 Access-Control-Max-Age
      maxAge: 3600
    },
    // 数据库
    typeorm: {
      dataSource: {
        // 自定义数据源名称
        testDataSource: {
          type: "mysql",
          charset: "utf8mb4",
          host: "192.168.1.55",
          port: 3306,
          username: "root",
          password: "123456",
          database: "test", // 数据库名
          synchronize: false, // 如果第一次使用，不存在表，有同步的需求可以写 true，注意会丢数据
          logging: ["error"], // 启用失败查询的日志记录
          maxQueryExecutionTime: 1000, // 记录所有运行超过1秒的查询
          poolSize: 10,
          dateStrings: true, // mysql 返回时间按 DATETIME 格式返回，只对 mysql 生效
          // 或者扫描形式
          entities: [
            "**/entity/*.entity{.ts,.js}"
          ]
          // 传入订阅类
          // subscribers: [EverythingSubscriber]
        }
        // 更多的数据源配置
      },
      // 多个数据源时可以用这个指定默认的数据源
      defaultDataSourceName: "testDataSource"
    },
    // 日志
    midwayLogger: {
      default: {
        level: "info",
        transports: {
          file: {
            dir: `/home/logs/midway-demo`,
            maxSize: "50m",
            maxFiles: "3d",
            fileLogName: "midway-demo-app.log",
            zippedArchive: true
          },
          error: {
            dir: "/home/logs/midway-demo",
            maxSize: "50m",
            maxFiles: "3d",
            fileLogName: "midway-demo-error.log",
            zippedArchive: true
          }
        }
      }
    },
    // redis
    redis: {
      clients: {
        instance1: {
          host: "192.168.1.55",
          port: 6379,
          password: "123456",
          db: 1,
          commandTimeout: 10000,
          connectTimeout: 10000
        },
        instance2: {
          host: "192.168.1.55",
          port: 6379,
          password: "123456",
          db: 2,
          commandTimeout: 10000,
          connectTimeout: 10000
        }
      }
    },
    // 监控
    prometheus: {
      labels: {
        APP_NAME: "midway-demo"
      }
    },
    // http请求
    axios: {
      clients: {
        default: {
          timeout: 3000, // default is `0` (no timeout)

          // `withCredentials` indicates whether or not cross-site Access-Control requests
          // should be made using credentials
          withCredentials: false // default
        },
        // 自定义实例，可以配置多个
        tronAxios: {
          baseURL: "https://api.trongrid.io",
          // `headers` are custom headers to be sent
          headers: {}
        }
      }
    },
    // 任务队列
    bull: {
      // 自动清理启动时前一次未调度的 重复执行任务, 默认 true
      clearRepeatJobWhenStart: true,
      defaultQueueOptions: {
        // 默认的任务配置
        defaultJobOptions: {
          // 保留成功的 10 条记录
          removeOnComplete: 10,
          // 保留失败的 10 条记录
          removeOnFail: 10
        },
        // 这些任务存储的 key，都是相同开头，以便区分用户原有 redis 里面的配置
        prefix: "{midway-demo}",
        redis: {
          host: "192.168.1.55",
          port: 6379,
          password: "123456",
          db: 3,
          commandTimeout: 10000,
          connectTimeout: 10000
        }
      }
    },
    // grpc
    grpcServer: {
      // 定义grpc的请求地址和端口
      url: "192.168.1.3:7701",
      services: [
        {
          protoPath: join(appInfo.appDir, "proto/demo.proto"),
          package: "protocol"
        }
      ]
    }
  };
}

