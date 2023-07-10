import { Pool } from "pg";
import config from "../config/default";
import logger from "./logger";

async function dbConnect() {
  const pool = new Pool({
    host: config.host,
    port: config.dbPort,
    user: config.user,
    password: config.password,
    database: config.database,
  });
  try {
    return await pool.connect();
  } catch (error) {
    logger.error("Could not connect to Db");
    process.exit(1);
  }
}

export default dbConnect;
