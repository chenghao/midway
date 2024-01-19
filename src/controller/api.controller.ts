import { Body, Controller, Get, Inject, Post, Query } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";
import { UserService } from "../service/user.service";
import { OmitTestReq, PickTestReq, Test1Req, TestReq } from "./module/req/test.req";
import { Test1Service } from "../service/test1.service";
import { DemoRedisService } from "../service/redis.service";
import { Validate } from "@midwayjs/validate";
import { BullQueue, InjectQueue } from "@midwayjs/bull";

@Controller("/api")
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;
  @Inject()
  test1Service: Test1Service;
  @Inject()
  demoRedisService: DemoRedisService;

  // 注入名称是 test 的任务队列
  @InjectQueue("test")
  testQueue: BullQueue;

  @Get("/ttt")
  async ttt() {
    // 执行任务队列
    await this.testQueue.runJob({ "aa": 11, "bb": 22 }, { delay: 5000 });

    return null;
  }

  @Get("/get_user")
  async getUser(@Query("uid") uid: number) {
    return await this.userService.getUser({ uid });
  }

  @Post("/test")
  @Validate({
    //locale: "zh_CN"
    errorStatus: 422
  })
  async test(@Body() testReq: TestReq) {
    const pickTestReq: PickTestReq = new PickTestReq();
    pickTestReq.firstName = "aaa";
    pickTestReq.lastName = "bbb";
    this.ctx.logger.info(`pickTestReq: ${JSON.stringify(pickTestReq)}`);

    const omitTestReq: OmitTestReq = new OmitTestReq();
    omitTestReq.id = 2;
    omitTestReq.firstName = "sss";
    omitTestReq.lastName = "wsx";
    this.ctx.logger.info(`omitTestReq: ${JSON.stringify(omitTestReq)}`);
  }

  @Get("/typeorm/getTest1")
  async getTest1(@Query("page") page: number,
                 @Query("size") size: number,
                 @Query("id") id?: number) {
    return await this.test1Service.getTest1Page(page, size, id);
  }

  @Post("/typeorm/addTest1")
  async addTest1(@Body() test1Req: Test1Req) {
    return await this.test1Service.addTest1(test1Req.name);
  }

  @Get("/redis/setRedis")
  async setRedis(@Query("key") key: string,
                 @Query("value") value: any,
                 @Query("expire") expire?: number) {
    await this.demoRedisService.set(key, value, expire);
  }

  @Get("/redis/getRedis")
  async getRedis(@Query("key") key: string) {
    return await this.demoRedisService.get(key);
  }

  @Get("/redis/delRedis")
  async delRedis(@Query("key") key: string) {
    await this.demoRedisService.del(key);
  }
}
