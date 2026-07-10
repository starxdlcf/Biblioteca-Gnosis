import { pool } from "../../config/database.js";

export class LivroGeneroRepository {
  constructor() {
    this.tableName = "livro_genero";
    this.pool = pool;
  }


  async findAll() {
    const result = await this.pool.query(`SELECT * FROM ${this.tableName}`);
    return result.rows;
  }


  async findById(idLivro) {
    const result = await this.pool.query(
      `SELECT * FROM ${this.tableName} WHERE id_livro = $1`,
      [idLivro]
    );
    return result.rows; 
  }

  async create(data) {
    const result = await this.pool.query(
      `INSERT INTO ${this.tableName} (id_livro, id_genero) VALUES ($1, $2) RETURNING *`,
      [data.id_livro, data.id_genero]
    );
    return result.rows[0];
  }


  async deleteRelation(idLivro, idGenero) {
    const result = await this.pool.query(
      `DELETE FROM ${this.tableName} WHERE id_livro = $1 AND id_genero = $2 RETURNING *`,
      [idLivro, idGenero]
    );
    return result.rows[0];
  }

  async delete(idLivro) {
    const result = await this.pool.query(
      `DELETE FROM ${this.tableName} WHERE id_livro = $1 RETURNING *`,
      [idLivro]
    );
    return result.rows;
  }
}