import { Request, Response } from "express";
import { upsertBills, getBillData, deleteById } from "../service/bills.service";
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

export const deleteByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    // Call the deleteById method on your database service
    await deleteById(id);

    // Return a success response
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    // Handle any errors that occur during the deletion process
    console.error("Error deleting item:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the item" });
  }
};
