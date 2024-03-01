import { App, Configuration, ILifeCycle, Logger } from "@midwayjs/core";
import { ILogger } from "@midwayjs/logger";
import * as koa from "@midwayjs/koa";
import * as validate from "@midwayjs/validate";
import * as info from "@midwayjs/info";
import * as crossDomain from "@midwayjs/cross-domain";
import * as typeorm from "@midwayjs/typeorm";
import * as sequelize from "@midwayjs/sequelize";
import * as mikro from "@midwayjs/mikro";
import * as redis from "@midwayjs/redis";
import * as prometheus from "@midwayjs/prometheus";
import * as axios from "@midwayjs/axios";
import * as bull from "@midwayjs/bull";
import * as grpc from "@midwayjs/grpc";
import * as consul from "@midwayjs/consul";
import { join } from "path";
import { DefaultErrorFilter } from "./filter/default.filter";
import { NotFoundFilter } from "./filter/notfound.filter";
import { ValidateErrorFilter } from "./filter/validate.filter";

//import { ReportMiddleware } from "./middleware/report.middleware";


@Configuration({
  imports: [
    koa,
    validate,
    crossDomain,
    typeorm,
    sequelize,
    mikro,
    redis,
    prometheus,
    axios,
    bull,
    grpc,
    consul,
    {
      component: info,
      enabledEnvironment: ["local"]
    }
  ],
  importConfigs: [join(__dirname, "./config")]
})
export class MainConfiguration implements ILifeCycle {
  @App("koa")
  app: koa.Application;

  // 业务应用级别的日志记录，使用 @Logger()
  // 组件或者框架层面的研发中，我们会使用 coreLogger 来记录日志，使用 @Logger('coreLogger')
  @Logger()
  logger: ILogger;

  /**
   * 在依赖注入容器 ready 的时候执行
   */
  async onReady() {
    // add middleware
    this.app.useMiddleware([]);
    // add filter
    this.app.useFilter([NotFoundFilter, DefaultErrorFilter, ValidateErrorFilter]);
  }

  /**
   * 在应用配置加载后执行
   */
  async onConfigLoad() {
    // 直接返回数据，会自动合并到配置中
    return {};
  }

  /**
   * 在应用服务启动后执行
   */
  async onServerReady() {
    this.logger.info("onServerReady: 项目启动完成。");
  }

  /**
   * 在应用停止的时候执行
   */
  async onStop() {
    this.logger.info("onStop: 项目关闭结束。");
  }
}
