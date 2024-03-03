import { Controller, Get, HttpStatus, Inject, InjectClient, MidwayError, Query } from "@midwayjs/core";
import { BalancerService } from "@midwayjs/consul";
import { Context } from "@midwayjs/koa";
import * as Consul from "consul";
import { HttpService, HttpServiceFactory } from "@midwayjs/axios";
import { buildChildTraceId } from "../interface";

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
    if (!service) {
      throw new MidwayError("获取consul服务失败");
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
    return await this.consul.kv.set(key, value);
  }

  @Get("/consul/getKey")
  async getKey(@Query("key") key: string) {
    // 获取value, 如果key不存在返回 undefined
    return await this.consul.kv.get(key);
  }

  @Get("/consul/delKey")
  async delKey(@Query("key") key: string) {
    return await this.consul.kv.del(key);
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
      throw new MidwayError("获取consul服务失败");
    }

    let serviceID = service.ServiceID;
    this.ctx.logger.info("serviceID: %s", serviceID);

    return await this.consul.agent.service.deregister(serviceID);
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

    return await this.consul.agent.service.register(consulConfig.service);
  }

  /**
   * consul 服务列表
   */
  @Get("/consul/list")
  async list() {
    return await this.consul.agent.service.list();
  }

  // 请求consul服务接口
  @Get("/consul/test1")
  async test1(@Query("serviceName") serviceName: string = "midway-demo") {
    const service = await this.balancerService.getServiceBalancer().select(serviceName);
    this.ctx.logger.info("service: %j", service);

    if (!service) {
      throw new MidwayError("获取consul服务失败");
    }

    let serviceAddress: string = service.ServiceAddress;
    let servicePort: string = service.ServicePort;

    let url: string = "http://" + serviceAddress + ":" + servicePort;
    url += "/api/typeorm/getTest1?page=1&size=10&startDate=2024-01-01&endDate=2024-01-30";
    this.ctx.logger.info("url: %s", url);

    let childHeader = await buildChildTraceId(this.ctx);
    let result = await this.apiAxios.get(url, { headers: childHeader });
    if (result.status === HttpStatus.OK.valueOf()) {
      return result.data;
    } else {
      throw new MidwayError("请求失败");
    }
  }
}
