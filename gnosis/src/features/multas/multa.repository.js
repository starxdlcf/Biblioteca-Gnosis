import { BaseRepository } from "../../base/base.repository.js";

export class MultaRepository extends BaseRepository {
  constructor() {
    super("multas", "id_multa");
  }

  async findEmprestimoById(id_emprestimo) {
    const result = await this.pool.query(
      "SELECT id_emprestimo FROM emprestimos WHERE id_emprestimo = $1",
      [id_emprestimo]
    );
    return result.rows[0];
  }

  async findByEmprestimoId(id_emprestimo) {
    const result = await this.pool.query(
      "SELECT * FROM multas WHERE id_emprestimo = $1",
      [id_emprestimo]
    );
    return result.rows[0];
  }

  async existsPendingByCarteirinha(id_carteirinha) {
    const result = await this.pool.query(
      `SELECT 1
       FROM emprestimos e
       JOIN multas m ON m.id_emprestimo = e.id_emprestimo
       WHERE e.id_carteirinha = $1
         AND m.pago = false
       LIMIT 1`,
      [id_carteirinha]
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
      `SELECT * FROM multas WHERE ${whereClause}`,
      values
    );
    return result.rows;
  }
}

export default MultaRepository;
