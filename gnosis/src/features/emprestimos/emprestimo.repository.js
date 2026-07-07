import { BaseRepository } from "../../base/base.repository.js";

export class EmprestimoRepository extends BaseRepository {
  constructor() {
    super("emprestimos", "id_emprestimo");
  }

  async findCarteirinhaById(id) {
    const result = await this.pool.query(
      "SELECT id_carteirinha FROM carteirinha WHERE id_carteirinha = $1",
      [id]
    );
    return result.rows[0];
  }

  async findLivroById(id) {
    const result = await this.pool.query(
      "SELECT id_livro FROM livros WHERE id_livro = $1",
      [id]
    );
    return result.rows[0];
  }
}

export default EmprestimoRepository;
