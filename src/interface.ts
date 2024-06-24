import { randomUUID } from "crypto";
import * as dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";
import * as timezone from "dayjs/plugin/timezone";
import { Context } from "@midwayjs/koa";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * 获取随机数， uuid
 */
export async function getRandomUUID() {
    let uuid = randomUUID();
    return uuid.replaceAll("-", "");
}

/**
 * 获取随机数字
 * @param min
 * @param max
 */
export async function getRandomNumber(min?: number, max?: number) {
    const range = max - min; // 取值范围差
    const random = Math.random(); // 小于1的随机数
    return min + Math.round(random * range); // 最小数加随机范围差
}

/**
 * 获取随机的 traceId, 10位数
 * @param min
 * @param max
 */
export async function getTraceId(min?: number, max?: number) {
    if (!min) {
        min = 1000000000;
    }
    if (!max) {
        max = 9999999999;
    }
    return getRandomNumber(min, max);
}

/**
 * 获取随机的 spanId, 6位数
 * @param min
 * @param max
 */
export async function getSpanId(min?: number, max?: number) {
    if (!min) {
        min = 100000;
    }
    if (!max) {
        max = 999999;
    }
    return getRandomNumber(min, max);
}

/**
 * 获取当前日期
 * 格式化后的日期
 */
export async function getCurrentDateStr() {
    return dayjs().tz("Asia/Shanghai").format("YYYY-MM-DD HH:mm:ss.SSS");
}

export function getCurrentDateStrSync() {
    return dayjs().tz("Asia/Shanghai").format("YYYY-MM-DD HH:mm:ss.SSS");
}

/**
 * 睡眠
 * @param ms
 */
export async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function buildChildTraceId(ctx: Context) {
    let header = ctx.request.header;
    if (header) {
        let traceid = header.traceid;
        if (traceid) {
            return { traceid: traceid };
        }
    }
    return {};
}

/**
 * @description User-Service parameters
 */
export interface IUserOptions {
    uid: number;
}

/**
 * 雪花ID生成器
 */
export class SnowflakeIDGenerator {
    // Configuration
    private static readonly EPOCH = 1577836800000; // Custom epoch (January 1, 2020)
    private static readonly DATA_CENTER_ID_BITS = 5;
    private static readonly MACHINE_ID_BITS = 5;
    private static readonly SEQUENCE_BITS = 2;

    // Max values
    private static readonly MAX_DATA_CENTER_ID = (1 << SnowflakeIDGenerator.DATA_CENTER_ID_BITS) - 1;
    private static readonly MAX_MACHINE_ID = (1 << SnowflakeIDGenerator.MACHINE_ID_BITS) - 1;
    private static readonly MAX_SEQUENCE = (1 << SnowflakeIDGenerator.SEQUENCE_BITS) - 1;

    // Bit shifts
    private static readonly MACHINE_ID_SHIFT = SnowflakeIDGenerator.SEQUENCE_BITS;
    private static readonly DATA_CENTER_ID_SHIFT = SnowflakeIDGenerator.SEQUENCE_BITS + SnowflakeIDGenerator.MACHINE_ID_BITS;
    private static readonly TIMESTAMP_SHIFT =
        SnowflakeIDGenerator.SEQUENCE_BITS + SnowflakeIDGenerator.MACHINE_ID_BITS + SnowflakeIDGenerator.DATA_CENTER_ID_BITS;

    private dataCenterId: number;
    private machineId: number;
    private sequence: number = 0;
    private lastTimestamp: number = -1;

    constructor(dataCenterId: number = 1, machineId: number = 1) {
        if (dataCenterId > SnowflakeIDGenerator.MAX_DATA_CENTER_ID || dataCenterId < 0) {
            throw new Error(`dataCenterId must be between 0 and ${SnowflakeIDGenerator.MAX_DATA_CENTER_ID}`);
        }
        if (machineId > SnowflakeIDGenerator.MAX_MACHINE_ID || machineId < 0) {
            throw new Error(`machineId must be between 0 and ${SnowflakeIDGenerator.MAX_MACHINE_ID}`);
        }
        this.dataCenterId = dataCenterId;
        this.machineId = machineId;
    }

    private currentTime(): number {
        return Date.now();
    }

    private waitUntilNextMillis(lastTimestamp: number): number {
        let timestamp = this.currentTime();
        while (timestamp <= lastTimestamp) {
            timestamp = this.currentTime();
        }
        return timestamp;
    }

    public nextId(): string {
        let timestamp = this.currentTime();

        if (timestamp < this.lastTimestamp) {
            throw new Error("Clock moved backwards. Refusing to generate id");
        }

        if (timestamp === this.lastTimestamp) {
            this.sequence = (this.sequence + 1) & SnowflakeIDGenerator.MAX_SEQUENCE;
            if (this.sequence === 0) {
                timestamp = this.waitUntilNextMillis(this.lastTimestamp);
            }
        } else {
            this.sequence = 0;
        }

        this.lastTimestamp = timestamp;

        return (
            (BigInt(timestamp - SnowflakeIDGenerator.EPOCH) << BigInt(SnowflakeIDGenerator.TIMESTAMP_SHIFT)) |
            (BigInt(this.dataCenterId) << BigInt(SnowflakeIDGenerator.DATA_CENTER_ID_SHIFT)) |
            (BigInt(this.machineId) << BigInt(SnowflakeIDGenerator.MACHINE_ID_SHIFT)) |
            BigInt(this.sequence)
        ).toString();
    }
}
