import { Request, Response } from "express";
import { upsertBills, getBillData } from "../service/bills.service";
import logger from "../utils/logger";

export async function createBillHandler<T extends object>(
  req: Request<any, any, T>,
  res: Response
) {
  try {
    const requestPayload = req.body as T;
    const result = await upsertBills(requestPayload);
    res.json(result);
  } catch (error) {
    logger.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getBill(req: any, res: any) {
  try {
    const data = await getBillData();
    res.json(data);
    logger.info("Response Fetched Successfully");
  } catch (error) {
    logger.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
