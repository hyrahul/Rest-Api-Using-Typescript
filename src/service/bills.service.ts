import { mapper } from "../middleware/customMapper";
import { ZOHO_READ_MAPPER } from "../middleware/mapper";
import { upsertQuery } from "../utils/dbQuery";
import config from "../config/default";
import { mapResponse, mappingConfig } from "../utils/helper";
import dbConnect from "../utils/connect";
import logger from "../utils/logger";

export async function upsertBills(bills) {
  try {
    const client = await dbConnect();

    const mappedBills = mapper(ZOHO_READ_MAPPER.BILLS, bills);
    console.log(mappedBills);
    const upsertQueries = mappedBills.map((mappedBill) =>
      upsertQuery(mappedBill, config.tableName, config.conflictColumn)
    );

    for (const query of upsertQueries) {
      await client.query(query);
    }

    client.release();
    return { message: "Data successfully upsert into the database" };
  } catch (error) {
    logger.error("Error:", error);
    throw new Error("Internal Server Error");
  }
}

export async function getBillData() {
  try {
    const tableName = config.tableName;
    const client = await dbConnect();
    const query = `SELECT * FROM ${tableName}`;
    const result = await client.query(query);
    client.release();
    const mappedResponse = mapResponse(result.rows, mappingConfig);
    return mappedResponse;
  } catch (error) {
    logger.error("Error: ", error);
    throw new Error("Internal Server Error");
  }
}
