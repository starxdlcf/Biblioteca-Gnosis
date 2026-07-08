import { pool } from "../../config/database.js";

/**
 * BaseRepository - Responsável apenas por operações SQL e acesso aos dados
 * Não contém lógica de negócio ou validações
 */
export class BaseRepository {
  constructor(tableName, idField = "id") {
    this.tableName = tableName;
    this.idField = idField;
    this.pool = pool;
  }

  async findAll() {
    const result = await this.pool.query(`SELECT * FROM ${this.tableName}`);
    return result.rows;
  }

  async findById(id) {
    const result = await this.pool.query(
      `SELECT * FROM ${this.tableName} WHERE ${this.idField} = $1`,
      [id]
    );
    return result.rows[0];
  }

  async create(data) {
    const columns = Object.keys(data).join(", ");
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

    const result = await this.pool.query(
      `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    return result.rows[0];
  }

  async update(id, data) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(", ");

    const result = await this.pool.query(
      `UPDATE ${this.tableName} SET ${setClause} WHERE ${this.idField} = $${columns.length + 1} RETURNING *`,
      [...values, id]
    );
    return result.rows[0];
  }

  async delete(id) {
    const result = await this.pool.query(
      `DELETE FROM ${this.tableName} WHERE ${this.idField} = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
}
