import { InjectEntityModel } from "@midwayjs/typeorm";
import { Test1Entity } from "../entity/test1.entity";
import { Repository } from "typeorm";
import { Inject, Provide } from "@midwayjs/core";
import { SelectQueryBuilder } from "typeorm/query-builder/SelectQueryBuilder";
import { Context } from "@midwayjs/koa";

@Provide()
export class Test1Service {
  // 指定使用哪个数据库， test就是在config.default.ts下的typeorm配置
  @InjectEntityModel(Test1Entity, "testDataSource")
  test1Repository: Repository<Test1Entity>;

  @Inject()
  ctx: Context;

  async getTest1Page(page: number, size: number, id?: number) {
    // await this.test1Repository.findAndCount({});

    let builder: SelectQueryBuilder<Test1Entity> = this.test1Repository.createQueryBuilder("test1")
      .skip((page - 1) * size)
      .take(size)
      .orderBy("test1.id", "DESC");
    if (id) {
      builder
        .where("test1.id=:id")
        .setParameters({ id: id });
    }

    let [data, total] = await builder.getManyAndCount();

    return {
      data,
      total,
      page,
      size
    };
  }

  async addTest1(name: string) {
    let test1Entity: Test1Entity = new Test1Entity();
    test1Entity.name = name;

    const result = await this.test1Repository.save(test1Entity);
    return result.id;
  }
}
