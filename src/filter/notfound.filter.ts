import { Catch, httpError, MidwayHttpError } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";

@Catch(httpError.NotFoundError)
export class NotFoundFilter {
  async catch(err: MidwayHttpError, ctx: Context) {
    // 404 错误会到这里
    //ctx.redirect('/404.html');
    ctx.logger.error(err.message);
    return {
      success: false,
      message: "未找到接口"
    };
  }
}
