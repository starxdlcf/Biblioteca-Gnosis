import { BaseRoutes } from "../../base/base.routes.js";

export class LivroGeneroRoutes extends BaseRoutes {
  constructor(controller) {
    super(controller, {
      tagName: "Livros",
      postBody: {
        type: "object",
        required: ["titulo", "isbn"],
        properties: {
          titulo: { type: "string", description: "Título do livro" },
          autor: { type: "string", description: "Nome do autor" },
          isbn: { type: "string", description: "Código ISBN do livro" }
        }
      },
      putBody: {
        type: "object",
        properties: {
          titulo: { type: "string" },
          autor: { type: "string" },
          isbn: { type: "string" }
        }
      }
    });
  }
}

export default LivroGeneroRoutes;