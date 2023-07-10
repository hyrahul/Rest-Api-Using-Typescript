import { mapper } from "../middleware/customMapper";
import { ZOHO_READ_MAPPER } from "../middleware/mapper";
import { upsertQuery } from "../utils/dbQuery";
import config from "../config/default";
import { mapResponse, mappingConfig } from "../utils/helper";
import dbConnect from "../utils/connect";
import logger from "../utils/logger";
import withTransaction from "../utils/transaction";

export async function upsertBills(bills) {
  return withTransaction(async (client) => {
    const mappedBills = mapper(ZOHO_READ_MAPPER.BILLS, bills);
    console.log(mappedBills);

    for (const mappedBill of mappedBills) {
      const query = upsertQuery(
        mappedBill,
        config.tableName,
        config.conflictColumn
      );
      await client.query(query);
    }

    return { message: "Data successfully upsert into the database" };
  });
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
