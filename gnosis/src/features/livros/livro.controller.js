import { BaseController } from "../../base/base.controller.js";

export class LivroController extends BaseController {
  constructor(service) {
    super(service);
  }


  async getByAuthor(request, reply) {
    try {
      const { autor } = request.params; // Pega o 'autor' da URL
      const data = await this.service.getByAuthor(autor);
      
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

  async getByTitle(request, reply) {
    try {
      const { titulo } = request.params; // Pega o 'titulo' da URL
      const data = await this.service.getByTitle(titulo);
      
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

  async getByISBN(request, reply) {
    try {
      const { isbn } = request.params; // Pega o 'isbn' da URL
      const data = await this.service.getByISBN(isbn);
      
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
}