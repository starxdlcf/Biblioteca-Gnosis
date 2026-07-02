const fastify = require("fastify")({
  logger: true,
});


require("dotenv").config();


const routes = require("./routes");
const errorHandler = require("./errors/errorHandler");


fastify.register(routes);


fastify.setErrorHandler(errorHandler);


const start = async () => {
  try {
    const port = process.env.PORT || 3333;


    await fastify.listen({
      port,
      host: "0.0.0.0",
    });


    console.log(`Servidor rodando na porta ${port}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};


start();
