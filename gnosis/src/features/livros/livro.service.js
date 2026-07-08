import { AppError } from "../../errors/AppError.js";

const ALLOWED_FIELDS = new Set(["titulo", "isbn"]);

export class LivroService {
  constructor(repository) {
    this.repository = repository;
  }

  async getAll() {
    try {
      return await this.repository.findAll();
    } catch (error) {
      console.error("❌ [BaseService - getAll] Erro original:", error);
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
      console.error("❌ [BaseService - getById] Erro original:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao buscar registro", 500);
    }
  }

  async create(data) {
    try {
      if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new AppError("Dados obrigatorios nao fornecidos", 400);
      }

      const payload = this.buildPayload(data);

      if (!payload.titulo) {
        throw new AppError("Titulo e obrigatorio", 400);
      }

      if (!payload.isbn) {
        throw new AppError("ISBN e obrigatorio", 400);
      }

      return await this.repository.create(payload);
    } catch (error) {
      console.error("❌ [BaseService - create] Erro original:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao criar registro", 500);
    }
  }

  async update(id, data) {
    try {
      if (!id) {
        throw new AppError("ID e obrigatorio", 400);
      }

      if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new AppError("Dados para atualizacao nao fornecidos", 400);
      }

      if (Object.keys(data).length === 0) {
        throw new AppError("Dados para atualizacao nao fornecidos", 400);
      }

      const existing = await this.repository.findById(id);
      if (!existing) {
        throw new AppError("Registro não encontrado", 404);
      }

      const payload = this.buildPayload(data);

      return await this.repository.update(id, payload);
    } catch (error) {
      console.error("❌ [BaseService - update] Erro original:", error);
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
      console.error("❌ [BaseService - delete] Erro original:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao deletar registro", 500);
    }
  }

  buildPayload(data) {
    const payload = {};

    for (const [key, value] of Object.entries(data)) {
      if (!ALLOWED_FIELDS.has(key)) {
        throw new AppError(`Campo nao permitido: ${key}`, 400);
      }

      const normalizedValue = value?.toString().trim();
      if (!normalizedValue) {
        if (key === "titulo") {
          throw new AppError("Titulo e obrigatorio", 400);
        }

        throw new AppError("ISBN e obrigatorio", 400);
      }

      payload[key] = normalizedValue;
    }

    return payload;
  }
}
