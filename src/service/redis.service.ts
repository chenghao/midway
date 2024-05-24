import { InjectClient, Provide } from "@midwayjs/core";
import { RedisService, RedisServiceFactory } from "@midwayjs/redis";

@Provide()
export class DemoRedisService {
    @InjectClient(RedisServiceFactory, "instance1")
    redis1: RedisService;

    @InjectClient(RedisServiceFactory, "instance3")
    redis2: RedisService;

    async set(key: string, value: any, expireTime?: number) {
        if (expireTime) {
            await this.redis1.setex(key, expireTime, value);
        } else {
            await this.redis1.set(key, value);
        }
    }

    async get(key: string) {
        return this.redis1.get(key);
    }

    async del(key: string) {
        await this.redis1.del(key);
    }
}
