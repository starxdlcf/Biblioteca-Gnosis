import { AppError } from "../../errors/AppError.js";


export class GeneroService {
  constructor(repository) {
    this.repository = repository;
  }

  async getAll() {
    try {
      return await this.repository.findAll();
    } catch (error) {
      throw new AppError("Erro ao buscar registros", 500);
    }
  }

  async getById(id) {
    try {
      if (!id) {
        throw new AppError("ID é obrigatório", 400);
      }

      const data = await this.repository.findById(id);
      if (!data) {
        throw new AppError("Registro não encontrado", 404);
      }
      return data;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao buscar registro", 500);
    }
  }

  async create(data) {
    try {
      if (!data || Object.keys(data).length === 0) {
        throw new AppError("Dados obrigatórios não fornecidos", 400);
      }
      return await this.repository.create(data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao criar registro", 500);
    }
  }

  async update(id, data) {
    try {
      if (!id) {
        throw new AppError("ID é obrigatório", 400);
      }

      if (!data || Object.keys(data).length === 0) {
        throw new AppError("Dados para atualização não fornecidos", 400);
      }

      const existing = await this.repository.findById(id);
      if (!existing) {
        throw new AppError("Registro não encontrado", 404);
      }

      return await this.repository.update(id, data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao atualizar registro", 500);
    }
  }

  async delete(id) {
    try {
      if (!id) {
        throw new AppError("ID é obrigatório", 400);
      }

      // 1. Verifica se o gênero existe
      const existing = await this.repository.findById(id);
      if (!existing) {
        throw new AppError("Registro não encontrado", 404);
      }

      // 2. NOVA REGRA: Verifica se existem livros vinculados na tabela livro_genero
      const livrosVinculados = await this.repository.countLivrosPorGenero(id);
      
      if (livrosVinculados > 0) {
        throw new AppError(
          `Não é possível excluir. Existem ${livrosVinculados} livro(s) vinculado(s) a este gênero.`, 
          409 // 409 Conflict: a requisição conflita com o estado atual do servidor
        );
      }

      // 3. Se passou pelas checagens, deleta em paz
      return await this.repository.delete(id);
      
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ [GeneroService - delete] Erro original:", error);
      throw new AppError("Erro ao deletar registro", 500);
    }
  }
}
