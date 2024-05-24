import { GrpcMethod, Inject, MSProviderType, Provider } from "@midwayjs/core";
import { protocol } from "../domain/demo";
import { Context } from "@midwayjs/koa";

/**
 * 实现 protocol.DemoService 接口的服务
 * {package: "protocol"} 这“protocol”是 demo.proto 文件中的package值
 * 类名 DemoService 要和demo.proto中的service名称相同
 */
@Provider(MSProviderType.GRPC, { package: "protocol" })
export class DemoService implements protocol.DemoService {
    @Inject()
    ctx: Context;

    @GrpcMethod()
    async create(data: protocol.DemoCreateRequest): Promise<protocol.DemoCreateResponse> {
        this.ctx.logger.info("name: %s, gender: %d", data.name, data.gender);

        //返回5-15之间的随机数
        return { id: Math.random() * 10 + 5 };
    }

    @GrpcMethod()
    async get(data: protocol.DemoGetRequest): Promise<protocol.DemoGetResponse> {
        this.ctx.logger.info("id: %d", data.id);
        return { id: data.id, name: "name", gender: 1 };
    }
}
