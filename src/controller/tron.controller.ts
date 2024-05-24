import { Controller, Get, Inject, Query } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";
import { TronService } from "../service/tron.service";
import { RuleType, Valid } from "@midwayjs/validate";

@Controller()
export class TronController {
    @Inject()
    ctx: Context;
    @Inject()
    tronService: TronService;

    @Get("/tron/getBlockTransaction")
    async getBlockTransaction(@Valid(RuleType.string().required().error(new Error("参数不能为空"))) @Query("txId") txId: string) {
        return await this.tronService.getBlockTransactionReq(txId);
    }
}
