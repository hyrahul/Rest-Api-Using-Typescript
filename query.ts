export function generateUpsertQuery(
  mappedData: any,
  tableName: string,
  conflictColumn: string
): string {
  if (!mappedData) {
    throw new Error("Mapped data is undefined or null");
  }

  const keys = Object.keys(mappedData);

  if (keys.length === 0) {
    throw new Error("Mapped data object is empty");
  }

  const columns = keys.join(", ");
  const values = keys.map((key) => formatValue(mappedData[key])).join(", ");
  const updateValues = keys.map((key) => `${key} = EXCLUDED.${key}`).join(", ");

  const query = `
    INSERT INTO ${tableName} (${columns})
    VALUES (${values})
    ON CONFLICT (${conflictColumn})
    DO UPDATE SET ${updateValues}
  `;
  console.log(query);
  return query;
}

function formatValue(value: any): string {
  if (typeof value === "string") {
    // Escape single quotes within the string
    return `'${value.replace(/'/g, "''")}'`;
  } else if (value instanceof Date) {
    // Format dates as strings in the expected format
    return `'${value.toISOString()}'`;
  } else if (typeof value === "object" && value !== null) {
    if (value.input_type === "number") {
      // Extract the number value from the object
      return String(value.input_type);
    } else if (value.hasOwnProperty("enum_mapper")) {
      // Handle enum mappings
      const enumValue = value.enum_mapper;
      return `'${enumValue}'`; // Wrap enum value in single quotes
    } else {
      // Convert objects to JSON strings
      return `'${JSON.stringify(value)}'`;
    }
  } else {
    // Use the value as-is for other types
    return String(value);
  }
}
