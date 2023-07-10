import { IntegrationType } from "../schema/types";
import { generateHash } from "../utils/helper";

interface Mapper {
  [key: string]: {
    field: string;
    input_type: string;
    output_type: string;
    enum_mapper?: string;
  };
}

interface Bill {
  [key: string]: any;
}

export function mapper(mapper: Mapper, bills: Bill[]): any[] {
  const mappedObjects: any[] = [];

  for (const bill of bills) {
    const mappedObject: any = {};

    for (const key in mapper) {
      if (mapper.hasOwnProperty(key)) {
        const value = mapper[key];
        const field = value.field;
        const inputType = value.input_type;
        const outputType = value.output_type;

        if (field in bill) {
          let fieldValue = bill[field];

          if (inputType === "string" && outputType === "date") {
            fieldValue = new Date(fieldValue);
          } else if (inputType === "number" && outputType === "number") {
            fieldValue = Number(fieldValue);
          }

          mappedObject[key] = fieldValue;
        }
      }
    }
    mappedObject.rootfi_integration_type = IntegrationType.ZOHO_BOOKS;
    mappedObject.raw_data = JSON.stringify(bill);
    mappedObject.line_items = [];
    mappedObject.memo = [];
    mappedObject.documents = [];
    mappedObject.payments = [];
    mappedObject.purchase_order_ids = [];
    mappedObject.data_hash = generateHash(mappedObject);
    mappedObjects.push(mappedObject);
  }

  return mappedObjects;
}
