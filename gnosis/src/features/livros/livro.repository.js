import { pool } from "../../config/database.js";



export class BaseRepository {
  constructor(livros, id_livro = "id") {
    this.tableName = livros;
    this.idField = id_livro;
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
    const allowedFields = ["titulo", "isbn"];
    const columns = Object.keys(data).filter((col) => allowedFields.includes(col));

    if (columns.length === 0) {
      throw new Error("Nenhum campo válido para atualizar");
    }

    const values = columns.map((col) => data[col]);
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

  async findByAuthor(author) {
    const search = `%${author}%`;
    const result = await this.pool.query(
      `SELECT * FROM ${this.tableName} WHERE autor ILIKE $1`,
      // o ILIKE é pra ignorar maiúscula e minúscula e o % serve pra buscar qualquer parte do nome do autor ou titulo ou enfim, então se a pessoa buscar Machado, encontra o machado de assis e por aí vai (comentei pq n sei se vc sabe, Ryan, dai te poupa pesquisar) - Anna
      [search]
    );
    return result.rows;
  }

  async findByTitle(title) {
    const search = `%${title}%`;
    const result = await this.pool.query(
      `SELECT * FROM ${this.tableName} WHERE titulo ILIKE $1`,
      [search]
    );
    return result.rows;
  }

  async findByISBN(isbn) {
    const search = `%${isbn}%`;
    const result = await this.pool.query(
      `SELECT * FROM ${this.tableName} WHERE isbn ILIKE $1`,
      [search]
    );
    return result.rows[0];
  }
}
