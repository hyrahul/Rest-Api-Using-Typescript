import { Pool } from "pg";
import config from "./config.json";
// Create a PostgreSQL client
export const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
});
