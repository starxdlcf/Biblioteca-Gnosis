import { BaseRoutes } from "../../base/base.routes.js";

export class LivroGeneroRoutes extends BaseRoutes {
  register(fastify) {
    
    fastify.get("/", async (request, reply) =>
      this.controller.getAll(request, reply)
    );

    fastify.get("/:id", async (request, reply) =>
      this.controller.getById(request, reply)
    );

    fastify.post("/", async (request, reply) =>
      this.controller.create(request, reply)
    );

    fastify.delete("/:idLivro/:idGenero", async (request, reply) =>
      this.controller.deleteRelation(request, reply)
    );
  }
}

export default LivroGeneroRoutes;