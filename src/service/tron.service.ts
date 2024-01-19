import { HttpStatus, Inject, InjectClient, Provide } from "@midwayjs/core";
import { HttpService, HttpServiceFactory } from "@midwayjs/axios";
import { Context } from "@midwayjs/koa";

@Provide()
export class TronService {
  @Inject()
  ctx: Context;

  @InjectClient(HttpServiceFactory, "tronAxios")
  tronAxios: HttpService;

  async getBlockTransactionReq(txId: string) {
    let result = await this.tronAxios.post("/walletsolidity/gettransactionbyid", { value: txId });

    if (result.status === HttpStatus.OK.valueOf()) {
      return result.data;
    } else {
      new Error("请求失败");
    }
  }
}
