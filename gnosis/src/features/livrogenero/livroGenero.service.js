import { AppError } from "../../errors/AppError.js";

export class LivroGeneroService {
  constructor(repository) {
    this.repository = repository;
  }

  async getAll() {
    try {
      return await this.repository.findAll();
    } catch (error) {
      console.error("[LivroGeneroService - getAll] Erro:", error);
      throw new AppError("Erro ao buscar vínculos.", 500);
    }
  }

  async getById(idLivro) {
    try {
      if (!idLivro) throw new AppError("ID do livro é obrigatório.", 400);
      return await this.repository.findById(idLivro);
    } catch (error) {
      console.error("[LivroGeneroService - getById] Erro:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao buscar vínculos do livro.", 500);
    }
  }

  async create(data) {
    try {
      if (!data.id_livro || !data.id_genero) {
        throw new AppError("id_livro e id_genero são obrigatórios.", 400);
      }
      return await this.repository.create(data);
    } catch (error) {
      console.error("[LivroGeneroService - create] Erro:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao criar vínculo.", 500);
    }
  }

  async deleteRelation(idLivro, idGenero) {
    try {
      if (!idLivro || !idGenero) {
        throw new AppError("id_livro e id_genero são obrigatórios.", 400);
      }
      
      const deleted = await this.repository.deleteRelation(idLivro, idGenero);
      if (!deleted) throw new AppError("Vínculo não encontrado.", 404);
      
      return deleted;
    } catch (error) {
      console.error("[LivroGeneroService - deleteRelation] Erro:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao deletar vínculo.", 500);
    }
  }
}