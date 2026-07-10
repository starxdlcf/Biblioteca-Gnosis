import { AppError } from "../../errors/AppError.js";

const ALLOWED_FIELDS = new Set(["id_livro", "id_autor"]);

export class LivroAutorService {
  constructor(repository) {
    this.repository = repository;
  }

  async getAll() {
    try {
      return await this.repository.findAll();
    } catch (error) {
      console.error("[LivroAutorService - getAll] Erro:", error);
      throw new AppError("Erro ao buscar vinculos.", 500);
    }
  }

  async getById(idLivro) {
    try {
      if (!idLivro) throw new AppError("ID do livro e obrigatorio.", 400);
      return await this.repository.findById(idLivro);
    } catch (error) {
      console.error("[LivroAutorService - getById] Erro:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao buscar vinculos do livro.", 500);
    }
  }

  async getByAuthor(idAutor) {
    try {
      if (!idAutor) throw new AppError("ID do autor e obrigatorio.", 400);
      return await this.repository.findBooksByAuthor(idAutor);
    } catch (error) {
      console.error("[LivroAutorService - getByAuthor] Erro:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao buscar livros do autor.", 500);
    }
  }

  async getRelation(idLivro, idAutor) {
    try {
      if (!idLivro || !idAutor) {
        throw new AppError("id_livro e id_autor sao obrigatorios.", 400);
      }

      const relation = await this.repository.findRelation(idLivro, idAutor);
      if (!relation) throw new AppError("Vinculo nao encontrado.", 404);

      return relation;
    } catch (error) {
      console.error("[LivroAutorService - getRelation] Erro:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao buscar vinculo.", 500);
    }
  }

  async create(data) {
    try {
      this.validateBody(data);

      if (!Object.prototype.hasOwnProperty.call(data, "id_livro") || !data.id_livro) {
        throw new AppError("id_livro e obrigatorio.", 400);
      }

      if (!Object.prototype.hasOwnProperty.call(data, "id_autor") || !data.id_autor) {
        throw new AppError("id_autor e obrigatorio.", 400);
      }

      return await this.repository.create({
        id_livro: data.id_livro,
        id_autor: data.id_autor,
      });
    } catch (error) {
      console.error("[LivroAutorService - create] Erro:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao criar vinculo.", 500);
    }
  }

  async deleteRelation(idLivro, idAutor) {
    try {
      if (!idLivro || !idAutor) {
        throw new AppError("id_livro e id_autor sao obrigatorios.", 400);
      }

      const deleted = await this.repository.deleteRelation(idLivro, idAutor);
      if (!deleted) throw new AppError("Vinculo nao encontrado.", 404);

      return deleted;
    } catch (error) {
      console.error("[LivroAutorService - deleteRelation] Erro:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao deletar vinculo.", 500);
    }
  }

  validateBody(data) {
    if (!data) {
      throw new AppError("Dados obrigatorios nao fornecidos.", 400);
    }

    if (typeof data !== "object" || Array.isArray(data)) {
      throw new AppError("O corpo da requisicao deve ser um objeto.", 400);
    }

    for (const field of Object.keys(data)) {
      if (!ALLOWED_FIELDS.has(field)) {
        throw new AppError(`Campo nao permitido: ${field}`, 400);
      }
    }
  }
}

export default LivroAutorService;
