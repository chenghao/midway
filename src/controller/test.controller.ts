import { Controller, Get, Inject } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";
import { Test1Entity } from "../sequelize_entity/test1.entity";
import { InjectRepository } from "@midwayjs/sequelize";
import { Repository } from "sequelize-typescript";

@Controller("/test")
export class TestController {
  @Inject()
  ctx: Context;

  @InjectRepository(Test1Entity, "testDataSource")
  test1Repository: Repository<Test1Entity>;

  @Get("/demo")
  async demo(): Promise<string> {
    return "Hello Midwayjs!";
  }

  @Get("/test")
  async test(): Promise<string> {
    // 使用原生sql
    let [result] = await this.test1Repository.sequelize.query("select * from test1 where name=?", { replacements: ["A"] });
    console.log(result);

    let result2 = await this.test1Repository.findAll({ order: [["name", "desc"]] });
    console.log(result2.map(item => item.dataValues));

    return "Hello Midwayjs!";
  }
}
