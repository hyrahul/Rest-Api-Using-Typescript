import dbConnect from "./connect";
import logger from "./logger";

async function withTransaction(callback) {
  const client = await dbConnect();
  try {
    await client.query("BEGIN"); // Start the transaction
    const result = await callback(client);
    await client.query("COMMIT"); // Commit the transaction
    logger.info("Transaction commit successfully");
    return result;
  } catch (error) {
    await client.query("ROLLBACK"); // Rollback the transaction
    logger.error("Transaction rollback because of : ", error);
    throw error;
  } finally {
    client.release();
  }
}

export default withTransaction;
