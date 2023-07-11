import { IntegrationType } from "../schema/types";
import { generateHash } from "../utils/helper";
import logger from "../utils/logger";
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
      const mappedObject = map(bill);
      mappedObjects.push(mappedObject);
    }
    logger.info("Inside Bills Array Mapping");
  } else {
    const bill = requestPayload;
    logger.info("Inside Bill Single Object Mapping");
    const mappedObject = map(bill);
    mappedObjects.push(mappedObject);
  }
  return mappedObjects;

  function map(bill: any) {
    const mappedObject: any = {};
    for (const key in mapper) {
      if (mapper.hasOwnProperty(key)) {
        const value = mapper[key];
        const field = value.field;
        const inputType = value.input_type;
        const outputType = value.output_type;

        if (field in bill) {
          const fieldValue = getMappedFieldValue(
            bill,
            field,
            inputType,
            outputType
          );
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
