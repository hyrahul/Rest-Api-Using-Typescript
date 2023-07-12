import { IntegrationType } from "../schema/types";
import { generateHash } from "../utils/helper";
import logger from "../utils/logger";
import { ZOHO_READ_MAPPER } from "./mapper";
interface Mapper {
  [key: string]: {
    field: string;
    input_type: string;
    output_type: string;
    enum_mapper?: string;
  };
}

export function mapper<T extends object, U extends object>(
  mapper: Mapper,
  requestPayload: U
): any {
  const mappedObjects: any[] = [];
  if (Array.isArray(requestPayload)) {
    const billsArray = requestPayload;
    for (const bill of billsArray) {
      const mappedObject = map(bill, mapper);
      mappedObject.line_items = [];
      mappedObjects.push(mappedObject);
    }
    logger.info("Inside Bills Array Mapping");
  } else {
    const bill = requestPayload;
    const lineItems = (bill as any).line_items;
    const mappedLineItems: any[] = [];
    let lineItemObject: any;
    const mappedObject = map(bill, mapper);
    for (const lineItem of lineItems) {
      lineItemObject = map(lineItem, ZOHO_READ_MAPPER.LINE_ITEMS);
    }
    mappedLineItems.push(lineItemObject);
    mappedObject["line_items"] = mappedLineItems;
    logger.info("Single Bill With Line Items : ", mappedObject);
    mappedObjects.push(mappedObject);
  }
  return mappedObjects;

  function map<T extends object, U extends object>(obj: T, mapper: Mapper) {
    const mappedObject: any = {};
    for (const key in mapper) {
      if (mapper.hasOwnProperty(key)) {
        const value = mapper[key];
        const field = value.field;
        const inputType = value.input_type;
        const outputType = value.output_type;

        if (field in obj) {
          const fieldValue = getMappedFieldValue(
            obj,
            field,
            inputType,
            outputType
          );
          mappedObject[key] = fieldValue;
        }
      }
    }
    mappedObject.rootfi_integration_type = IntegrationType.ZOHO_BOOKS;
    mappedObject.raw_data = JSON.stringify(obj);
    mappedObject.memo = [];
    mappedObject.documents = [];
    mappedObject.payments = [];
    mappedObject.purchase_order_ids = [];
    mappedObject.data_hash = generateHash(mappedObject);
    return mappedObject;
  }
}

function getMappedFieldValue(
  bill: any,
  field: string,
  inputType: string,
  outputType: string
): any {
  let fieldValue = bill[field];

  if (inputType === "string" && outputType === "date") {
    fieldValue = new Date(fieldValue);
  } else if (inputType === "number" && outputType === "number") {
    fieldValue = Number(fieldValue);
  }

  return fieldValue;
}
