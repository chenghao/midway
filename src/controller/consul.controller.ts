import { Controller, Get, HttpStatus, Inject, InjectClient, Query } from "@midwayjs/core";
import { BalancerService } from "@midwayjs/consul";
import { Context } from "@midwayjs/koa";
import * as Consul from "consul";
import { HttpService, HttpServiceFactory } from "@midwayjs/axios";

@Controller()
export class ConsulController {
  @Inject()
  ctx: Context;

  @Inject()
  balancerService: BalancerService;

  @Inject("consul:consul")
  consul: Consul.Consul;

  @InjectClient(HttpServiceFactory, "default")
  apiAxios: HttpService;

  @Get("/consul/getServiceName")
  async getServiceName(@Query("serviceName") serviceName: string = "midway-demo") {
    // passingOnly=true  只查询健康的服务， 默认是true (可不传该参数)
    // passingOnly=false 只查询不健康的服务
    const service = await this.balancerService.getServiceBalancer().select(serviceName, true);
    this.ctx.logger.info("service: %j", service);
    if (!service) {
      throw new Error("获取consul服务失败");
    }

    // 我们可以通过 ServiceAddress 和 ServicePort 去连接目标服务，比如做http请求等

    return service;
  }

  /**
   * consul配置中心
   * 设置key
   * @param key
   * @param value
   */
  @Get("/consul/setKey")
  async setKey(@Query("key") key: string, @Query("value") value: string) {
    // 设置成功时返回 true
    const res = await this.consul.kv.set(key, value);

    this.ctx.logger.info(res);

    return res;
  }

  @Get("/consul/getKey")
  async getKey(@Query("key") key: string) {
    // 获取value, 如果key不存在返回 undefined
    const res = await this.consul.kv.get(key);

    this.ctx.logger.info(res);

    return res === undefined ? {} : res;
  }

  @Get("/consul/delKey")
  async delKey(@Query("key") key: string) {
    const res = await this.consul.kv.del(key);

    this.ctx.logger.info(res);

    return res;
  }

  /**
   * consul 下线服务
   * @param serviceName
   */
  @Get("/consul/deregister")
  async deregister(@Query("serviceName") serviceName: string = "midway-demo") {
    const service = await this.balancerService.getServiceBalancer().select(serviceName);
    this.ctx.logger.info("service: %j", service);

    if (!service) {
      throw new Error("获取consul服务失败");
    }

    let serviceID = service.ServiceID;

    await this.consul.agent.service.deregister(serviceID);
  }

  /**
   * consul 上线服务
   * @param serviceName
   */
  @Get("/consul/register")
  async register(@Query("serviceName") serviceName: string = "midway-demo") {
    // 文档: https://www.midwayjs.org/docs/req_res_app#getapp
    // 从当前上下文的app对象, 再获取consul的配置
    let consulConfig = this.ctx.app.getConfig("consul");
    this.ctx.logger.info("consulConfig: %j", consulConfig);

    await this.consul.agent.service.register(consulConfig.service);
  }

  /**
   * consul 服务列表
   */
  @Get("/consul/list")
  async list() {
    let res = await this.consul.agent.service.list();
    this.ctx.logger.info(res);

    return res;
  }

  // 请求consul服务接口
  @Get("/consul/test1")
  async test1(@Query("serviceName") serviceName: string = "midway-demo") {
    const service = await this.balancerService.getServiceBalancer().select(serviceName);
    this.ctx.logger.info("service: %j", service);

    if (!service) {
      throw new Error("获取consul服务失败");
    }

    let serviceAddress: string = service.ServiceAddress;
    let servicePort: string = service.ServicePort;

    let url: string = "http://" + serviceAddress + ":" + servicePort + "/api/typeorm/getTest1?page=1&size=10";
    this.ctx.logger.info("url: %s", url);

    let result = await this.apiAxios.get(url);
    if (result.status === HttpStatus.OK.valueOf()) {
      return result.data;
    } else {
      new Error("请求失败");
    }
  }
}