import { pool } from "../../config/database.js";

export class LivroAutorRepository {
  constructor() {
    this.tableName = "livro_autor";
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

  async findBooksByAuthor(idAutor) {
    const result = await this.pool.query(
      `SELECT l.id_livro, l.titulo
       FROM livros l
       JOIN ${this.tableName} la ON la.id_livro = l.id_livro
       WHERE la.id_autor = $1`,
      [idAutor]
    );
    return result.rows;
  }

  async findRelation(idLivro, idAutor) {
    const result = await this.pool.query(
      `SELECT * FROM ${this.tableName} WHERE id_livro = $1 AND id_autor = $2`,
      [idLivro, idAutor]
    );
    return result.rows[0];
  }

  async create(data) {
    const result = await this.pool.query(
      `INSERT INTO ${this.tableName} (id_livro, id_autor) VALUES ($1, $2) RETURNING *`,
      [data.id_livro, data.id_autor]
    );
    return result.rows[0];
  }

  async deleteRelation(idLivro, idAutor) {
    const result = await this.pool.query(
      `DELETE FROM ${this.tableName} WHERE id_livro = $1 AND id_autor = $2 RETURNING *`,
      [idLivro, idAutor]
    );
    return result.rows[0];
  }
}

export default LivroAutorRepository;
