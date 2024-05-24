import { Aspect, IMethodAspect, Inject, JoinPoint } from "@midwayjs/core";
import { ILogger } from "@midwayjs/logger";
import { Context } from "@midwayjs/koa";
import { APIController } from "../controller/api.controller";
import { TronController } from "../controller/tron.controller";
import { ConsulController } from "../controller/consul.controller";
import { getSpanId, getTraceId } from "../interface";

@Aspect([APIController, TronController, ConsulController])
export class LogAspect implements IMethodAspect {
    @Inject()
    logger: ILogger;

    /**
     * 请求之前
     * 可以修改入参和调用原方法
     * @param point
     */
    async before(point: JoinPoint) {
        let ctx: Context = point.target.ctx;
        if (ctx) {
            if (!ctx.request.header.traceid) {
                ctx.request.header.traceid = (await getTraceId()) + "";
            }
            if (!ctx.spanid) {
                ctx.spanid = await getSpanId();
            }

            if (["GET", "get"].includes(ctx.method)) {
                ctx.logger.info("params: %j", ctx.request.querystring);
            } else if (["POST", "post"].includes(ctx.method)) {
                ctx.logger.info("params: %j", ctx.request.body);
            }
        }
    }

    /**
     * 请求之后返回值
     * @param point
     * @param result
     */
    async afterReturn(point: JoinPoint, result: any) {
        // result=null时说明方法返回的值就是null
        // result=undefined时说明方法是void
        let ctx: Context = point.target.ctx;
        if (ctx) {
            ctx.logger.debug("result: %j", result);
        }

        if (result && result.success) {
            return result;
        }

        let res = { success: true, message: "成功" };
        if (result === null || result === undefined) {
            return res;
        } else {
            // 当res没有定义类型时又需要往里面加字段，可以使用 (res as any).字段=值
            (res as any).result = result;
            return res;
        }
    }

    /**
     * 最后
     * @param point
     * @param result
     * @param error
     */
    async after(point: JoinPoint, result: any, error: Error) {
        let ctx: Context = point.target.ctx;
        if (ctx) {
            ctx.request.header.traceid = "";
            ctx.spanid = "";
        }
    }
}
