import { Catch } from "@midwayjs/core";
import { MidwayValidationError } from "@midwayjs/validate";
import { Context } from "@midwayjs/koa";

@Catch(MidwayValidationError)
export class ValidateErrorFilter {
  async catch(err: MidwayValidationError, ctx: Context) {
    ctx.logger.error(err.message);

    return {
      success: false,
      message: "校验参数错误, " + err.message
    };
  }
}
