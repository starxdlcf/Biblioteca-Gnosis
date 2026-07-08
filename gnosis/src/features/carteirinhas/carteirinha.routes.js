import { BaseRoutes } from "../../base/base.routes.js";

export class CarteirinhaRoutes extends BaseRoutes {
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

    fastify.put("/:id", async (request, reply) =>
      this.controller.update(request, reply)
    );

    fastify.delete("/:id", async (request, reply) =>
      this.controller.delete(request, reply)
    );
  }
}

export default CarteirinhaRoutes;
