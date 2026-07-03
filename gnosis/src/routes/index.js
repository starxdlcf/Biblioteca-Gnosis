export default async function routes(fastify) {
  fastify.get("/", async () => {
    return {
      message: "✅ API Biblioteca Gnosis funcionando",
      version: "1.0.0",
    };
  });
}
