import { BaseController } from "../../base/base.controller.js";

export class MultaController extends BaseController {
  constructor(service) {
    super(service);
  }

  async getAll(request, reply) {
    try {
      const data = await this.service.getAll(request.query);
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

export default MultaController;
