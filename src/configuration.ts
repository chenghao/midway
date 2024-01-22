import { App, Configuration } from "@midwayjs/core";
import * as koa from "@midwayjs/koa";
import * as validate from "@midwayjs/validate";
import * as info from "@midwayjs/info";
import * as crossDomain from "@midwayjs/cross-domain";
import * as typeorm from "@midwayjs/typeorm";
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
export class MainConfiguration {
  @App("koa")
  app: koa.Application;

  async onReady() {
    // add middleware
    this.app.useMiddleware([]);
    // add filter
    this.app.useFilter([NotFoundFilter, DefaultErrorFilter, ValidateErrorFilter]);
  }
}
