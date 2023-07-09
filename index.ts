import express from "express";
import { mapBillsToMapper } from "./custom";
import { ZOHO_READ_MAPPER } from "./mapper";
import { generateUpsertQuery } from "./query";
import { pool } from "./dbClient";
import config from "./config.json";

// Create an Express server
const app = express();
const port = process.env.PORT || config.server.port;

// Middleware to parse JSON request bodies
app.use(express.json());

// Endpoint to handle the requests
app.post("/", async (req, res) => {
  try {
    // Extract the bills array from the request payload
    const { bills } = req.body;

    const client = await pool.connect();

    // Map and upsert the bills data
    const mappedBills = mapBillsToMapper(ZOHO_READ_MAPPER.BILLS, bills);
    console.log(mappedBills);
    const upsertQueries = mappedBills.map((mappedBill: any) =>
      generateUpsertQuery(
        mappedBill,
        config.database.tableName,
        config.database.conflictColumn
      )
    );

    // Execute the upsert queries
    for (const query of upsertQueries) {
      await client.query(query);
    }

    //release the client
    client.release();
    res.json({ message: "Data successfully upserted into the database" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
