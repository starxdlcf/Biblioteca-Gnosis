import { BaseRoutes } from "../../base/base.routes.js";

export class GeneroRoutes extends BaseRoutes {
  constructor(controller) {
    super(controller, {
      tagName: "Gêneros", // nome q aparece na interface do Swagger
      postBody: {
        type: "object",
        required: ["nome"],
        properties: {
          nome: { type: "string", description: "Nome do gênero literário" }
        }
      },
      putBody: {
        type: "object",
        properties: {
          nome: { type: "string", description: "Novo nome do gênero literário" }
        }
      }
    });
  }
}

export default GeneroRoutes;
