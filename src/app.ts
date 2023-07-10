import dbConnect from "./utils/connect";
import express from "express";
import config from "./config/default";
import logger from "./utils/logger";
import routes from "./routes";

const app = express();
const port = config.port;
app.use(express.json());

// Start the server
app.listen(port, async () => {
  logger.info(`Server is running at http://localhost:${port}`);

  await dbConnect();
  logger.info("Db Connected");
  routes(app);
});
