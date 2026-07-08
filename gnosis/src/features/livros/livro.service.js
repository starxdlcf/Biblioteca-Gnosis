import { AppError } from "../../errors/AppError.js";

export class BaseService {
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

      const existing = await this.repository.findById(id);
      if (!existing) {
        throw new AppError("Registro não encontrado", 404);
      }

      return await this.repository.delete(id);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao deletar registro", 500);
    }
  }

  async getByAuthor(author) {
    try {
      if (!author) {
        throw new AppError("O nome do autor é obrigatório para a busca", 400);
      }
      return await this.repository.findByAuthor(author);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao buscar livros por autor", 500);
    }
  }

  async getByTitle(title) {
    try {
      if (!title) {
        throw new AppError("O título é obrigatório para a busca", 400);
      }
      return await this.repository.findByTitle(title);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao buscar livros por título", 500);
    }
  }

  async getByISBN(isbn) {
    try {
      if (!isbn) {
        throw new AppError("O ISBN é obrigatório para a busca", 400);
      }
      const data = await this.repository.findByISBN(isbn);
      if (!data) {
        throw new AppError("Livro com este ISBN não foi encontrado", 404);
      }
      return data;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao buscar livro por ISBN", 500);
    }
  }
}