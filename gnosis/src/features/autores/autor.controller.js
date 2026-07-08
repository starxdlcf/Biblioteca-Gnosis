import { BaseController } from "../../base/base.controller.js";

export class AutorController extends BaseController {
  constructor(service) {
    super(service);
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

export default AutorController;
