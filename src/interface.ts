import { randomUUID } from "crypto";
import * as dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";
import * as timezone from "dayjs/plugin/timezone";

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
 * 获取当前日期
 * 格式化后的日期
 */
export function getCurrentDateStr() {
  return dayjs().tz("Asia/Shanghai").format("YYYY-MM-DD HH:mm:ss.SSS");
}


export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @description User-Service parameters
 */
export interface IUserOptions {
  uid: number;
}
