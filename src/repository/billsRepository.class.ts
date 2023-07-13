import { FilterQuery } from "mongoose";
import { Pool, QueryConfig } from "pg";
import config from "../config/default";
import logger from "../utils/logger";

export class Repository<T> {
  private pool: Pool;

  constructor() {
    // Create a connection pool
    this.pool = new Pool({
      host: config.host,
      port: config.dbPort,
      user: config.user,
      password: config.password,
      database: config.database,
    });
  }

  async create(entity: T, tableName: string): Promise<T> {
    const columns = Object.keys(entity).join(", ");
    const values = Object.values(entity);

    const query = {
      text: `INSERT INTO ${tableName} (${columns}) VALUES (${createValuePlaceholders(
        values
      )}) RETURNING *`,
      values,
    };

    const result = await this.execute(query);
    return result.rows[0];
  }

  async update(id: string, entity: T, tableName: string): Promise<T> {
    const columns = Object.keys(entity);
    const values = Object.values(entity);
    const updateQuery = columns
      .map((column, index) => `${column} = $${index + 2}`)
      .join(", ");

    const query = {
      text: `UPDATE ${tableName} SET ${updateQuery} WHERE id = $1 RETURNING *`,
      values: [id, ...values],
    };

    const result = await this.execute(query);
    return result.rows[0];
  }

  async upsert(
    data: any,
    tableName: string,
    conflictColumns: string[],
    updateColumns: string[]
  ): Promise<any> {
    const columns = Object.keys(data).join(", ");
    const values = Object.values(data);
    const conflictClause = createConflictClause(conflictColumns);
    const updateClause = createUpdateClause(updateColumns, values.length + 1);

    const query = {
      text: `INSERT INTO ${tableName} (${columns}) VALUES (${createValuePlaceholders(
        values
      )}) ON CONFLICT ${conflictClause} DO UPDATE SET ${updateClause} RETURNING *`,
      values,
    };

    const result = await this.execute(query);
    return result.rows[0];
  }

  async delete(id: string, tableName: string): Promise<void> {
    const query = {
      text: `DELETE FROM ${tableName} WHERE rootfi_id = $1`,
      values: [id],
    };
    logger.info(query);
    await this.execute(query);
  }

  async findOne(filter: FilterQuery<T>, tableName: string): Promise<T | null> {
    const query = {
      text: `SELECT * FROM ${tableName} WHERE ${createWhereClause(
        filter
      )} LIMIT 1`,
      values: Object.values(filter),
    };

    const result = await this.execute(query);
    return result.rows[0] || null;
  }

  async findMany(filter: FilterQuery<T>, tableName: string): Promise<T[]> {
    const query = {
      text: `SELECT * FROM ${tableName} WHERE ${createWhereClause(filter)}`,
      values: Object.values(filter),
    };

    const result = await this.execute(query);
    return result.rows;
  }

  async execute(query: QueryConfig): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(query);
      return result;
    } finally {
      client.release();
    }
  }
}

function createConflictClause(conflictColumns: string[]): string {
  const columns = conflictColumns.join(", ");
  return `(${columns})`;
}

// Helper function to create the update clause for upsert query
function createUpdateClause(
  updateColumns: string[],
  startingIndex: number
): string {
  let updateClause = "";
  for (let i = 0; i < updateColumns.length; i++) {
    updateClause += `${updateColumns[i]} = $${startingIndex + i}`;
    if (i !== updateColumns.length - 1) {
      updateClause += ", ";
    }
  }
  return updateClause;
}

// Helper function to create value placeholders for INSERT query
function createValuePlaceholders(values: any[]): string {
  let placeholders = "";
  for (let i = 1; i <= values.length; i++) {
    placeholders += `$${i}`;
    if (i !== values.length) {
      placeholders += ", ";
    }
  }
  return placeholders;
}

// Helper function to create the WHERE clause for SELECT queries
function createWhereClause(filter: any): string {
  const conditions = Object.keys(filter)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(" AND ");
  return conditions;
}
