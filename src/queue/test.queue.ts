import { IProcessor } from "@midwayjs/bull";
import { Inject } from "@midwayjs/core";
import { ILogger } from "@midwayjs/logger";

/**
 * 任务队列执行器，队列名称 test
 */
/*@Processor(
    "test"
    // 使用cron运行任务，每30秒执行一次
    , {
        repeat: {
            cron: FORMAT.CRONTAB.EVERY_PER_30_SECOND
        }
    }
)*/
export class TestProcessor implements IProcessor {
    @Inject()
    logger: ILogger;

    async execute(data: any) {
        this.logger.info("data: %j", data);
    }
}
