import { BaseController } from "../../base/base.controller.js";

export class LivroAutorController extends BaseController {
  constructor(service) {
    super(service);
  }

  async getById(request, reply) {
    try {
      const { idLivro } = request.params;
      const data = await this.service.getById(idLivro);
      return reply.status(200).send({
        success: true,
        data,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return reply.status(statusCode).send({
        success: false,
        message: error.message,
      });
    }
  }

  async getByAuthor(request, reply) {
    try {
      const { idAutor } = request.params;
      const data = await this.service.getByAuthor(idAutor);
      return reply.status(200).send({
        success: true,
        data,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return reply.status(statusCode).send({
        success: false,
        message: error.message,
      });
    }
  }

  async getRelation(request, reply) {
    try {
      const { idLivro, idAutor } = request.params;
      const data = await this.service.getRelation(idLivro, idAutor);
      return reply.status(200).send({
        success: true,
        data,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return reply.status(statusCode).send({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteRelation(request, reply) {
    try {
      const { idLivro, idAutor } = request.params;
      const result = await this.service.deleteRelation(idLivro, idAutor);
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

export default LivroAutorController;
