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
