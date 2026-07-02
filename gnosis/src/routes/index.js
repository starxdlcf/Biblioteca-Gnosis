async function routes(fastify) {
  fastify.get("/", async () => {
    return {
      message: "API Biblioteca Gnosis funcionando",
    };
  });
}


module.exports = routes;
