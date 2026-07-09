import { BaseController } from "../../base/base.controller.js";

export class LivroGeneroController extends BaseController {
  constructor(service) {
    super(service);
  }

  async deleteRelation(request, reply) {
    try {
      const { idLivro, idGenero } = request.params;
      const result = await this.service.deleteRelation(idLivro, idGenero);
      return reply.status(200).send({ success: true, data: result });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return reply.status(statusCode).send({
        success: false,
        message: error.message || "Erro interno no servidor",
      });
    }
  }
}