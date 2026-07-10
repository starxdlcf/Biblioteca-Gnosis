import fastifyApp from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import routes from "./src/routes/index.js";
import errorHandler from "./src/errors/errorHandler.js";

// Carregar variáveis de ambiente
const envResult = dotenv.config();
if (envResult.error && envResult.error.code !== "ENOENT") {
  console.warn("⚠️ Aviso ao carregar .env:", envResult.error);
}

console.log("✓ Variáveis de ambiente carregadas");
console.log(`   PORT configurado: ${process.env.PORT || "não definido, usando 3002"}`);

const fastify = fastifyApp();

console.log("✓ Fastify inicializado");

fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
});

console.log("✓ CORS registrado");

fastify.register(routes);

console.log("✓ Routes registradas");

fastify.setErrorHandler(errorHandler);

console.log("✓ ErrorHandler registrado");

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n📌 Recebido sinal: ${signal}`);
  console.log("🛑 Encerrando servidor graciosamente...");
  try {
    await fastify.close();
    console.log("✓ Servidor encerrado com sucesso");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao encerrar:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

const start = async () => {
  try {
    const port = parseInt(process.env.PORT) || 3002;

    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error(`Porta inválida: ${port}`);
    }

    console.log(`\n✓ Iniciando servidor na porta ${port}...`);
    
    await fastify.listen({
      port,
      host: "0.0.0.0",
    });

    console.log(`✅ Servidor rodando na porta ${port}`);
    console.log(`📍 URL: http://localhost:${port}`);
  } catch (error) {
    if (error.code === "EADDRINUSE") {
      console.error(`\n❌ ERRO: Porta ${error.port} já está em uso!`);
      console.error("   Verifique se outro processo está usando essa porta:");
      console.error(`   netstat -ano | findstr :${error.port}`);
      console.error("\n   Para matar o processo:");
      console.error(`   taskkill /PID [PID] /F`);
    } else {
      console.error("\n❌ Erro ao iniciar servidor:", error.message);
      console.error(error);
    }
    process.exit(1);
  }
};

start();
