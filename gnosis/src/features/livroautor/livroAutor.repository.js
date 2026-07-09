import { BaseRepository } from "../../base/base.repository.js";

export class LivroAutorRepository extends BaseRepository {
  constructor() {
    super("livro_autor", "id_livro");
  }

  async findById(id) {
    const { id_livro, id_autor } = this.parseCompositeId(id);

    const result = await this.pool.query(
      "SELECT * FROM livro_autor WHERE id_livro = $1 AND id_autor = $2",
      [id_livro, id_autor]
    );
    return result.rows[0];
  }

  async update(id, data) {
    const current = this.parseCompositeId(id);
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map((column, index) => `${column} = $${index + 1}`).join(", ");

    const result = await this.pool.query(
      `UPDATE livro_autor
       SET ${setClause}
       WHERE id_livro = $${columns.length + 1}
         AND id_autor = $${columns.length + 2}
       RETURNING *`,
      [...values, current.id_livro, current.id_autor]
    );
    return result.rows[0];
  }

  async delete(id) {
    const { id_livro, id_autor } = this.parseCompositeId(id);

    const result = await this.pool.query(
      "DELETE FROM livro_autor WHERE id_livro = $1 AND id_autor = $2 RETURNING *",
      [id_livro, id_autor]
    );
    return result.rows[0];
  }

  async findLivroById(id_livro) {
    const result = await this.pool.query(
      "SELECT id_livro FROM livros WHERE id_livro = $1",
      [id_livro]
    );
    return result.rows[0];
  }

  async findAutorById(id_autor) {
    const result = await this.pool.query(
      "SELECT id_autor FROM autores WHERE id_autor = $1",
      [id_autor]
    );
    return result.rows[0];
  }

  async findByLivroAutor(id_livro, id_autor) {
    const result = await this.pool.query(
      "SELECT * FROM livro_autor WHERE id_livro = $1 AND id_autor = $2",
      [id_livro, id_autor]
    );
    return result.rows[0];
  }

  async existsByAutor(id_autor) {
    const result = await this.pool.query(
      "SELECT 1 FROM livro_autor WHERE id_autor = $1 LIMIT 1",
      [id_autor]
    );
    return result.rowCount > 0;
  }

  async findByFilters(filters) {
    const columns = Object.keys(filters);
    const values = Object.values(filters);
    const whereClause = columns
      .map((column, index) => `${column} = $${index + 1}`)
      .join(" AND ");

    const result = await this.pool.query(
      `SELECT * FROM livro_autor WHERE ${whereClause}`,
      values
    );
    return result.rows;
  }

  parseCompositeId(id) {
    const [id_livro, id_autor] = String(id).split("-").map(Number);
    return { id_livro, id_autor };
  }
}

export default LivroAutorRepository;
