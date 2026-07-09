import { BaseRoutes } from "../../base/base.routes.js";

export class MultaRoutes extends BaseRoutes {
  constructor(controller) {
    super(controller, {
      tagName: "Multas",
      postBody: {
        type: "object",
        required: ["id_emprestimo", "valor_total"],
        properties: {
          id_emprestimo: { type: "number", description: "ID do empréstimo gerador da multa" },
          valor_total: { type: "number", description: "Valor total da multa" }
        }
      },
      putBody: {
        type: "object",
        properties: {
          status: { type: "string", description: "Ex: Pendente, Paga" }
        }
      }
    });
  }
}

export default MultaRoutes;