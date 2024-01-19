import { Catch } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";

@Catch()
export class DefaultErrorFilter {
  async catch(err: Error, ctx: Context) {
    ctx.logger.error(err.stack);

    // 所有的未分类错误会到这里
    return {
      success: false,
      message: err.message
    };
  }
}
