import crypto from "crypto";

export function generateHash(mappedObject: any): string {
  const hash = crypto.createHash("sha256");
  hash.update(JSON.stringify(mappedObject));
  const hashValue = hash.digest("hex");
  return hashValue;
}

type MappingConfig<T> = {
  [K in keyof T]: keyof T[K];
};

export function mapResponse<T>(
  response: T[],
  mappingConfig: MappingConfig<T>
): T[] {
  return response.map((item) => {
    const mappedItem: Partial<T> = {} as Partial<T>;
    for (const key in mappingConfig) {
      const targetKey = mappingConfig[key] as keyof T;
      if (item.hasOwnProperty(key) && targetKey) {
        mappedItem[targetKey] = item[key];
      }
    }
    return mappedItem as T;
  });
}

export const mappingConfig = {
  document_number: "document_number",
  documents: "documents",
  payments: "payments",
  due_date: "due_date",
  line_items: "line_items",
  contact_id: "contact_id",
  currency_rate: "currency_rate",
  purchase_order_ids: "purchase_order_ids",
  updated_at: "updated_at",
  total_amount: "total_amount",
  platform_id: "platform_id",
  currency: "currency",
  amount_due: "amount_due",
  posted_date: "posted_date",
  status: "status",
  raw_data: "raw_data",
  data_hash: "data_hash",
};
