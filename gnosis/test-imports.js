console.log("Testing imports...");

try {
  console.log("1. Loading fastify...");
  import("fastify").then(() => console.log("✓ fastify loaded"));
  
  console.log("2. Loading dotenv...");
  import("dotenv").then(() => console.log("✓ dotenv loaded"));
  
  console.log("3. Loading routes...");
  import("./src/routes/index.js").then(() => console.log("✓ routes loaded"));
  
  console.log("4. Loading errorHandler...");
  import("./src/errors/errorHandler.js").then(() => console.log("✓ errorHandler loaded"));
  
  console.log("5. Loading database config...");
  import("./src/config/database.js").then(() => console.log("✓ database loaded"));
} catch (error) {
  console.error("Error:", error);
  process.exit(1);
}
