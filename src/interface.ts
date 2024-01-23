import { randomUUID } from "crypto";

export async function getRandomUUID() {
  let uuid = randomUUID();
  return uuid.replaceAll("-", "");
}

/**
 * @description User-Service parameters
 */
export interface IUserOptions {
  uid: number;
}
