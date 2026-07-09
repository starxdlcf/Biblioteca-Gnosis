import { BaseRoutes } from "../../base/base.routes.js";

export class LivroRoutes extends BaseRoutes {
  constructor(controller) {
    super(controller, {
      tagName: "Livros",
      postBody: {
        type: "object",
        required: ["titulo", "isbn"],
        properties: {
          titulo: { type: "string", description: "Título do livro" },
          autor: { type: "string", description: "Nome do autor" },
          isbn: { type: "string", description: "Código ISBN do livro" }
        }
      },
      putBody: {
        type: "object",
        properties: {
          titulo: { type: "string" },
          autor: { type: "string" },
          isbn: { type: "string" }
        }
      }
    });
  }

  register(fastify) {
    
    super.register(fastify);


    // BUSCA POR AUTOR
    fastify.get("/autor/:autor", {
      schema: {
        tags: ["Livros"], // Usa a mesma tag para agrupar tudo bonitinho
        description: "Busca livros pelo nome ou parte do nome do autor (Usa ILIKE)",
        params: {
          type: "object",
          properties: { 
            autor: { type: "string", description: "Nome do autor" } 
          }
        }
      }
    }, async (request, reply) => this.controller.getByAuthor(request, reply)); 

    // BUSCA POR TÍTULO
    fastify.get("/titulo/:titulo", {
      schema: {
        tags: ["Livros"],
        description: "Busca livros pelo título ou parte dele (Usa ILIKE)",
        params: {
          type: "object",
          properties: { 
            titulo: { type: "string", description: "Título do livro" } 
          }
        }
      }
    }, async (request, reply) => this.controller.getByTitle(request, reply));

    // BUSCA POR ISBN
    fastify.get("/isbn/:isbn", {
      schema: {
        tags: ["Livros"],
        description: "Busca um livro específico através do seu ISBN",
        params: {
          type: "object",
          properties: { 
            isbn: { type: "string", description: "Código ISBN exato do livro" } 
          }
        }
      }
    }, async (request, reply) => this.controller.getByISBN(request, reply));
  }
}

export default LivroRoutes;
