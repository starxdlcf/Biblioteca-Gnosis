import { BaseRoutes } from "../../base/base.routes.js";

export class EmprestimoRoutes extends BaseRoutes {
  constructor(controller) {
    super(controller, {
      tagName: "Empréstimos",
      postBody: {
        type: "object",
        required: ["id_livro", "id_carteirinha"],
        properties: {
          id_livro: { type: "number", description: "ID do livro emprestado" },
          id_carteirinha: { type: "number", description: "ID da carteirinha do usuário" },
          data_devolucao: { type: "string", format: "date", description: "Data prevista (YYYY-MM-DD)" }
        }
      },
      putBody: {
        type: "object",
        properties: {
          data_devolucao: { type: "string", format: "date" },
          status: { type: "string", description: "Status do empréstimo (ex: Devolvido)" }
        }
      }
    });
  }
}

export default EmprestimoRoutes;