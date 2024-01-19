import { Controller, Get, Inject } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";

@Controller("/test")
export class TestController {
  @Inject()
  ctx: Context;

  @Get("/demo")
  async demo(): Promise<string> {
    return "Hello Midwayjs!";
  }
}
