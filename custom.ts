import { ZOHO_READ_MAPPER } from "./mapper";
import { IntegrationType } from "./types";

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

export function mapBillsToMapper(mapper: Mapper, bills: Bill[]): any[] {
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
    mappedObject.raw_data = JSON.stringify(bills);
    mappedObject.line_items = JSON.stringify(ZOHO_READ_MAPPER.LINE_ITEMS);
    mappedObjects.push(mappedObject);
  }

  return mappedObjects;
}
