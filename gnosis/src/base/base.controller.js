/**
 * BaseController - Responsável apenas pela comunicação entre camadas
 * Converte requests em chamadas de serviço e formata responses HTTP
 * Sem lógica de negócio
 */
export class BaseController {
  constructor(service) {
    this.service = service;
  }

  async getAll(request, reply) {
    try {
      const data = await this.service.getAll();
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

  async getById(request, reply) {
    try {
      const { id } = request.params;
      const data = await this.service.getById(id);
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

  async create(request, reply) {
    try {
      const data = await this.service.create(request.body);
      return reply.status(201).send({
        success: true,
        data,
        message: "Registro criado com sucesso",
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return reply.status(statusCode).send({
        success: false,
        message: error.message,
      });
    }
  }

  async update(request, reply) {
    try {
      const { id } = request.params;
      const data = await this.service.update(id, request.body);
      return reply.status(200).send({
        success: true,
        data,
        message: "Registro atualizado com sucesso",
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return reply.status(statusCode).send({
        success: false,
        message: error.message,
      });
    }
  }

  async delete(request, reply) {
    try {
      const { id } = request.params;
      await this.service.delete(id);
      return reply.status(200).send({
        success: true,
        message: "Registro deletado com sucesso",
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
