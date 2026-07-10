import { BaseRepository } from "../../base/base.repository.js";

export class AutorRepository extends BaseRepository {
  constructor() {
    super("autores", "id_autor");
  }

  async findByNome(nome) {
    const result = await this.pool.query(
      "SELECT * FROM autores WHERE nome ILIKE $1",
      [`%${nome.trim()}%`]
    );
    return result.rows;
  }

  async countLivrosPorAutor(id) {
    const result = await this.pool.query(
      "SELECT COUNT(*) FROM livro_autor WHERE id_autor = $1",
      [id]
    );
    return parseInt(result.rows[0].count, 10);
  }
}

export default AutorRepository;
