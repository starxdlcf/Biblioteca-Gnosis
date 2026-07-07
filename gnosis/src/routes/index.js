import { CarteirinhaController } from "../features/carteirinhas/carteirinha.controller.js";
import { CarteirinhaRoutes } from "../features/carteirinhas/carteirinha.routes.js";
import { CarteirinhaService } from "../features/carteirinhas/carteirinha.service.js";
import { EmprestimoController } from "../features/emprestimos/emprestimo.controller.js";
import { EmprestimoRoutes } from "../features/emprestimos/emprestimo.routes.js";
import { EmprestimoService } from "../features/emprestimos/emprestimo.service.js";

export default async function routes(fastify) {
  fastify.get("/", async () => {
    return {
      message: "✅ API Biblioteca Gnosis funcionando",
      version: "1.0.0",
    };
  });

  const carteirinhaService = new CarteirinhaService();
  const carteirinhaController = new CarteirinhaController(carteirinhaService);
  const carteirinhaRoutes = new CarteirinhaRoutes(carteirinhaController);

  fastify.register(
    async (instance) => {
      carteirinhaRoutes.register(instance);
    },
    { prefix: "/carteirinhas" }
  );

  const emprestimoService = new EmprestimoService();
  const emprestimoController = new EmprestimoController(emprestimoService);
  const emprestimoRoutes = new EmprestimoRoutes(emprestimoController);

  fastify.register(
    async (instance) => {
      emprestimoRoutes.register(instance);
    },
    { prefix: "/emprestimos" }
  );
}
