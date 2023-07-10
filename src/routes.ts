import { Express, Request, Response } from "express";
import { createBillHandler, getBill } from "../src/controller/bills.controller";

function routes(app: Express) {
  app.get("/healthCheck", (req: Request, res: Response) => res.sendStatus(200));
  app.post("/", createBillHandler);
  app.get("/data", getBill);
}

export default routes;
