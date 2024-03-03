import { Controller, Get, Inject } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";
import { Test1Entity } from "../sequelize_entity/test1.entity";
import { InjectRepository } from "@midwayjs/sequelize";
import { Repository } from "sequelize-typescript";
import { Op } from "sequelize";
import { InjectEntityManager, InjectRepository as MikroInjectRepository } from "@midwayjs/mikro";
import { EntityManager, EntityRepository, QueryOrder } from "@mikro-orm/mysql";
import { Test1Entity as Test1EntityMikro } from "../mikro_entity/test1.entity";

@Controller("/test")
export class TestController {
  @Inject()
  ctx: Context;

  @InjectRepository(Test1Entity, "testDataSource")
  test1Repository: Repository<Test1Entity>;

  @MikroInjectRepository(Test1EntityMikro, "testDataSource")
  test1RepositoryM: EntityRepository<Test1EntityMikro>;
  @InjectEntityManager()
  em: EntityManager;

  @Get("/demo")
  async demo(): Promise<string> {
    return "Hello Midwayjs!";
  }

  @Get("/test")
  async test(): Promise<string> {
    // 使用原生sql
    let [result] = await this.test1Repository.sequelize.query("select * from test1 where name=?", { replacements: ["A"] });
    console.log(result);

    // raw: true 时禁用包装，返回原始结果
    let result2 = await this.test1Repository.findAll({ order: [["name", "desc"]], raw: true });
    console.log(result2);

    let count = await this.test1Repository.count({ where: { createTime: { [Op.gt]: "2024-01-17 18:00:00" } } });
    console.log(count);

    // bulkCreate 是批量创建，接收数组
    let test1 = await this.test1Repository.create({ name: "CCC" });
    console.log(test1.id);

    return "Hello Midwayjs!";
  }

  @Get("/test2")
  async test2() {
    const qb = this.em.createQueryBuilder(Test1EntityMikro);
    qb.select(["id", "name"])
      .where({ createTime: { $gt: "2024-01-17 18:00:00" } })
      .orderBy({ name: QueryOrder.DESC });
    const test1 = await qb.getResult();
    console.log(test1);

    let result2 = await this.test1RepositoryM.findAll({ orderBy: { "name": QueryOrder.DESC } });
    console.log(result2);

    let count = await this.test1RepositoryM.count({ $and: [{ createTime: { $gt: "2024-01-17 18:00:00" } }] });
    console.log(count);


    let test1Entity = new Test1EntityMikro("AAA");
    await this.em.persistAndFlush(test1Entity);
    console.log(test1Entity.id);

    return result2;
  }
}
