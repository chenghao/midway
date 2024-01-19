import { IProcessor, Processor } from "@midwayjs/bull";
import { Inject } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";

/**
 * 任务队列执行器，队列名称 test
 */
@Processor("test"
  // 使用cron运行任务，每30秒执行一次
  // , {
  //   repeat: {
  //     cron: FORMAT.CRONTAB.EVERY_PER_30_SECOND
  //   }
  // }
)
export class TestProcessor implements IProcessor {
  @Inject()
  ctx: Context;

  async execute(data: any) {
    this.ctx.logger.info(data);
  }
}
