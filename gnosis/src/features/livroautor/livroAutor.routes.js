import { BaseRoutes } from "../../base/base.routes.js";

export class LivroAutorRoutes extends BaseRoutes {
  constructor(controller) {
    super(controller, {
      tagName: "LivroAutor",
      postBody: {
        type: "object",
        required: ["id_livro", "id_autor"],
        additionalProperties: false,
        properties: {
          id_livro: { type: "integer", description: "ID do livro" },
          id_autor: { type: "integer", description: "ID do autor" },
        },
      },
    });
  }

  register(fastify) {
    const errorResponse = {
      type: "object",
      properties: {
        success: { type: "boolean", example: false },
        message: { type: "string" },
      },
    };

    fastify.get("/", {
      schema: {
        tags: [this.tagName],
        description: "Lista todos os vinculos livro_autor",
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: { type: "array", items: { type: "object", additionalProperties: true } },
            },
          },
          500: errorResponse,
        },
      },
    }, async (request, reply) =>
      this.controller.getAll(request, reply)
    );

    fastify.get("/autor/:idAutor", {
      schema: {
        tags: [this.tagName],
        description: "Busca livros vinculados a um autor",
        params: {
          type: "object",
          required: ["idAutor"],
          properties: {
            idAutor: { type: "string", description: "ID do autor" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id_livro: { type: "integer" },
                    titulo: { type: "string" },
                  },
                },
              },
            },
          },
          400: errorResponse,
          500: errorResponse,
        },
      },
    }, async (request, reply) =>
      this.controller.getByAuthor(request, reply)
    );

    fastify.get("/:idLivro/:idAutor", {
      schema: {
        tags: [this.tagName],
        description: "Busca um vinculo livro_autor especifico",
        params: {
          type: "object",
          required: ["idLivro", "idAutor"],
          properties: {
            idLivro: { type: "string", description: "ID do livro" },
            idAutor: { type: "string", description: "ID do autor" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: { type: "object", additionalProperties: true },
            },
          },
          400: errorResponse,
          404: errorResponse,
          500: errorResponse,
        },
      },
    }, async (request, reply) =>
      this.controller.getRelation(request, reply)
    );

    fastify.get("/:idLivro", {
      schema: {
        tags: [this.tagName],
        description: "Busca autores vinculados a um livro",
        params: {
          type: "object",
          required: ["idLivro"],
          properties: {
            idLivro: { type: "string", description: "ID do livro" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: { type: "array", items: { type: "object", additionalProperties: true } },
            },
          },
          400: errorResponse,
          500: errorResponse,
        },
      },
    }, async (request, reply) =>
      this.controller.getById(request, reply)
    );

    fastify.post("/", {
      schema: {
        tags: [this.tagName],
        description: "Cria um novo vinculo livro_autor",
        body: this.postBody,
        response: {
          201: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: { type: "string" },
              data: { type: "object", additionalProperties: true },
            },
          },
          400: errorResponse,
          409: errorResponse,
          500: errorResponse,
        },
      },
    }, async (request, reply) =>
      this.controller.create(request, reply)
    );

    fastify.delete("/:idLivro/:idAutor", {
      schema: {
        tags: [this.tagName],
        description: "Remove um vinculo livro_autor",
        params: {
          type: "object",
          required: ["idLivro", "idAutor"],
          properties: {
            idLivro: { type: "string", description: "ID do livro" },
            idAutor: { type: "string", description: "ID do autor" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              data: { type: "object", additionalProperties: true },
            },
          },
          400: errorResponse,
          404: errorResponse,
          500: errorResponse,
        },
      },
    }, async (request, reply) =>
      this.controller.deleteRelation(request, reply)
    );
  }
}

export default LivroAutorRoutes;
