import { BaseRoutes } from "../../base/base.routes.js";

export class AutorRoutes extends BaseRoutes {
  constructor(controller) {
    super(controller, {
      tagName: "Autores",
      postBody: {
        type: "object",
        required: ["nome"],
        properties: {
          nome: { type: "string", description: "Nome do autor" }
        }
      },
      putBody: {
        type: "object",
        properties: {
          nome: { type: "string", description: "Novo nome do autor" }
        }
      }
    });
  }
}

export default AutorRoutes;
