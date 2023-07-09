import { DataModels } from "./types";

const INTEGRATION_NAME = "ZOHO_BOOKS";
const default_ID = (data_model: DataModels) =>
  `${INTEGRATION_NAME}_${data_model}_${"READ"}_${0}`;

/*
field: - the field name is the request (zoho's schema), 
input_type: "string", output_type: "string" - easy to understand,
parser: "ZOHO_BOOKS_PARSE_LINE_ITEM_TYPE" - the function that will be used to parse the field,
enum_mapper: "ARTIFACT_STATUS_ENUM" - the enum that will be used to parse the field,
mapping: default_ID(DataModels.LINE_ITEMS) - the mapping ID that will be used to save the data,
*/

// the keys (like platform_id, document_number etc) are the field names that will be in the response (our schema)
export const ZOHO_READ_MAPPER = {
  BILLS: {
    platform_id: {
      field: "bill_id",
      input_type: "string",
      output_type: "string",
    },
    document_number: {
      field: "bill_number",
      input_type: "string",
      output_type: "string",
    },
    posted_date: { field: "date", input_type: "string", output_type: "date" },
    due_date: { field: "due_date", input_type: "string", output_type: "date" },
    contact_id: {
      field: "vendor_id",
      input_type: "string",
      output_type: "string",
    },
    currency: {
      field: "currency_code",
      input_type: "string",
      output_type: "string",
    },
    status: {
      field: "status",
      input_type: "string",
      output_type: "string",
      enum_mapper: "ARTIFACT_STATUS_ENUM",
    },
    total_amount: {
      field: "total",
      input_type: "number",
      output_type: "number",
    },
    amount_due: {
      field: "balance",
      input_type: "number",
      output_type: "number",
    },
    updated_at: {
      field: "last_modified_time",
      input_type: "string",
      output_type: "date",
    },
    currency_rate: {
      field: "exchange_rate",
      input_type: "number",
      output_type: "number",
    },
  },
  LINE_ITEMS: {
    platform_id: {
      field: "line_item_id",
      input_type: "string",
      output_type: "string",
      parser: "ZOHO_BOOKS_LINE_PARSER_PLATFORM_ID",
    },
    line_item_type: {
      field: "line_item_type",
      input_type: "string",
      output_type: "string",
      parser: "ZOHO_BOOKS_PARSE_LINE_ITEM_TYPE",
    },
    line_item_type_id: {
      field: "line_item_type_id",
      input_type: "string",
      output_type: "string",
      parser: "ZOHO_BOOKS_PARSE_LINE_ITEM_LINK_ID",
    },
    description: {
      field: "description",
      input_type: "string",
      output_type: "string",
    },
    item_id: {
      field: "item_id",
      input_type: "string",
      output_type: "string",
    },
    total_discount: {
      field: "discount",
      input_type: "number",
      output_type: "number",
    },
    quantity: {
      field: "quantity",
      input_type: "number",
      output_type: "number",
    },

    total_amount: {
      field: "total_amount",
      input_type: "number",
      output_type: "number",
      parser: "ZOHO_BOOKS_LINE_ITEM_TOTAL_AMOUNT",
    },
    account_id: {
      field: "account_id",
      input_type: "string",
      output_type: "string",
    },
    tracking_category_ids: {
      field: "tracking_category_ids",
      input_type: "array",
      output_type: "array",
    },
    tax_id: { field: "tax_id", input_type: "string", output_type: "string" },
    updated_at: {
      field: "updated_at",
      input_type: "string",
      output_type: "string",
    },
    sub_total: {
      field: "item_total",
      input_type: "number",
      output_type: "number",
    },
    tax_amount: {
      field: "tax_amount",
      input_type: "number",
      output_type: "number",
      parser: "ZOHO_LINE_ITEMS_TAX_AMOUNT",
    },
  },
};
