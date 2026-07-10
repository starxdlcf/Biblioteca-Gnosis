import { BaseRoutes } from "../../base/base.routes.js";

export class CarteirinhaRoutes extends BaseRoutes {
  constructor(controller) {
    super(controller, {
      tagName: "Carteirinhas",
      postBody: {
        type: "object",
        required: ["id_carteirinha"], // Ajuste conforme seu banco
        properties: {
          id_usuario: { type: "number", description: "ID do usuário associado" },
          data_validade: { type: "string", format: "date", description: "Validade (YYYY-MM-DD)" }
        }
      },
      putBody: {
        type: "object",
        properties: {
          data_validade: { type: "string", format: "date" }
        }
      }
    });
  }
}

export default CarteirinhaRoutes;