/* eslint-disable no-console */
import { createClient } from "redis";
import config from "../../config";

const redisClient = createClient({
  username: config.REDIS.REDIS_USERNAME,
  password: config.REDIS.REDIS_PASSWORD,
  socket: {
    host: config.REDIS.REDIS_HOST,
    port: Number(config.REDIS.REDIS_PORT),
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

// await client.set("foo", "bar");
// const result = await client.get("foo");
// console.log(result); // >>> bar

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Redis Connected");
  }
};
