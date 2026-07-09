/**
 * BaseRoutes - Responsável apenas pelo mapeamento de rotas HTTP e Documentação Swagger
 * Conecta requisições HTTP aos métodos do controller
 */
export class BaseRoutes {
  // constructor aceita as configuracoes do swagger
  constructor(controller, swaggerConfig = {}) {
    this.controller = controller;
    
    // configurações padrão
    this.tagName = swaggerConfig.tagName || "Sem Categoria";
    this.postBody = swaggerConfig.postBody || { type: "object", additionalProperties: true };
    this.putBody = swaggerConfig.putBody || { type: "object", additionalProperties: true };
  }

  register(fastify) {
    const errorResponse = {
      type: "object",
      properties: {
        success: { type: "boolean", example: false },
        message: { type: "string" },
      },
    };

    // GET ALL
    fastify.get("/", {
      schema: {
        tags: [this.tagName],
        description: `Lista todos os registros de ${this.tagName}`,
        response: {
          200: { 
            type: "object", 
            properties: {
              success: { type: "boolean", example: true },
              data: { type: "array", items: { type: "object", additionalProperties: true } }
            }
          },
          500: errorResponse
        }
      }
    }, async (request, reply) =>
      this.controller.getAll(request, reply)
    );

    // GET BY ID
    fastify.get("/:id", {
      schema: {
        tags: [this.tagName],
        description: `Busca um registro de ${this.tagName} pelo ID`,
        params: {
          type: "object",
          properties: { id: { type: "string", description: "ID do registro" } },
        },
        response: {
          200: { 
            type: "object", 
            properties: {
              success: { type: "boolean", example: true },
              data: { type: "object", additionalProperties: true }
            }
          },
          400: errorResponse,
          404: errorResponse,
          500: errorResponse
        }
      }
    }, async (request, reply) =>
      this.controller.getById(request, reply)
    );

    // POST
    fastify.post("/", {
      schema: {
        tags: [this.tagName],
        description: `Cria um novo registro em ${this.tagName}`,
        body: this.postBody, // Lê o corpo exigido na classe filha
        response: {
          201: { 
            type: "object", 
            properties: {
              success: { type: "boolean", example: true },
              message: { type: "string" },
              data: { type: "object", additionalProperties: true }
            }
          },
          400: errorResponse,
          409: errorResponse,
          500: errorResponse
        }
      }
    }, async (request, reply) =>
      this.controller.create(request, reply)
    );

    // PUT 
    fastify.put("/:id", {
      schema: {
        tags: [this.tagName],
        description: `Atualiza um registro existente em ${this.tagName}`,
        params: {
          type: "object",
          properties: { id: { type: "string" } },
        },
        body: this.putBody, // Lê o corpo de atualização da classe filha
        response: {
          200: { 
            type: "object", 
            properties: {
              success: { type: "boolean", example: true },
              message: { type: "string" },
              data: { type: "object", additionalProperties: true }
            }
          },
          400: errorResponse,
          404: errorResponse,
          500: errorResponse
        }
      }
    }, async (request, reply) =>
      this.controller.update(request, reply)
    );

    // DELETE
    fastify.delete("/:id", {
      schema: {
        tags: [this.tagName],
        description: `Deleta um registro de ${this.tagName}`,
        params: {
          type: "object",
          properties: { id: { type: "string" } },
        },
        response: {
          200: { 
            type: "object", 
            properties: { 
              success: { type: "boolean", example: true },
              message: { type: "string" }
            } 
          },
          400: errorResponse,
          404: errorResponse,
          409: errorResponse,
          500: errorResponse
        }
      }
    }, async (request, reply) =>
      this.controller.delete(request, reply)
    );
  }
}