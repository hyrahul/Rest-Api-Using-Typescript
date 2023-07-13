import { Express, Request, Response } from "express";
import {
  createBillHandler,
  getBill,
  deleteByIdHandler,
} from "../src/controller/bills.controller";

function routes(app: Express) {
  app.get("/healthCheck", (req: Request, res: Response) => res.sendStatus(200));
  app.post("/", createBillHandler);
  app.get("/data", getBill);
  app.delete("/bill/:id", deleteByIdHandler); // http://localhost:3000/bill/123
}

export default routes;
