import { AppError } from "../../errors/AppError.js";
import { BaseService } from "../../base/base.service.js";
import { LivroAutorRepository } from "./livroAutor.repository.js";

const ALLOWED_FIELDS = new Set(["id_livro", "id_autor"]);
const ALLOWED_FILTERS = new Set(["id_livro", "id_autor"]);

export class LivroAutorService extends BaseService {
  constructor(repository = new LivroAutorRepository()) {
    super(repository);
  }

  async getAll(filters = {}) {
    try {
      const payload = this.buildFilterPayload(filters);

      if (Object.keys(payload).length === 0) {
        return await this.repository.findAll();
      }

      return await this.repository.findByFilters(payload);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao buscar registros", 500);
    }
  }

  async getById(id) {
    try {
      const compositeId = this.parseCompositeId(id);
      const data = await this.repository.findById(this.formatCompositeId(compositeId));

      if (!data) {
        throw new AppError("Vinculo livro-autor nao encontrado", 404);
      }

      return data;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao buscar vinculo livro-autor", 500);
    }
  }

  async create(data) {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new AppError("Dados obrigatorios nao fornecidos", 400);
    }

    const payload = this.buildPayload(data);

    if (payload.id_livro === undefined) {
      throw new AppError("id_livro e obrigatorio", 400);
    }

    if (payload.id_autor === undefined) {
      throw new AppError("id_autor e obrigatorio", 400);
    }

    await this.validateLivroAndAutor(payload);

    const existing = await this.repository.findByLivroAutor(payload.id_livro, payload.id_autor);
    if (existing) {
      throw new AppError("Ja existe vinculo entre este livro e este autor", 400);
    }

    return super.create(payload);
  }

  async update(id, data) {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new AppError("Dados para atualizacao nao fornecidos", 400);
    }

    if (Object.keys(data).length === 0) {
      throw new AppError("Dados para atualizacao nao fornecidos", 400);
    }

    const currentId = this.parseCompositeId(id);
    const existing = await this.repository.findById(this.formatCompositeId(currentId));

    if (!existing) {
      throw new AppError("Vinculo livro-autor nao encontrado", 404);
    }

    const payload = this.buildPayload(data);
    const nextId = {
      id_livro: payload.id_livro ?? existing.id_livro,
      id_autor: payload.id_autor ?? existing.id_autor,
    };

    await this.validateLivroAndAutor(payload);

    const duplicate = await this.repository.findByLivroAutor(nextId.id_livro, nextId.id_autor);
    if (duplicate && this.formatCompositeId(duplicate) !== this.formatCompositeId(currentId)) {
      throw new AppError("Ja existe vinculo entre este livro e este autor", 400);
    }

    return await this.repository.update(this.formatCompositeId(currentId), payload);
  }

  async delete(id) {
    try {
      const compositeId = this.parseCompositeId(id);
      const formattedId = this.formatCompositeId(compositeId);
      const existing = await this.repository.findById(formattedId);

      if (!existing) {
        throw new AppError("Vinculo livro-autor nao encontrado", 404);
      }

      return await this.repository.delete(formattedId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao deletar vinculo livro-autor", 500);
    }
  }

  buildFilterPayload(filters) {
    const payload = {};

    if (!filters || typeof filters !== "object") {
      return payload;
    }

    for (const [key, value] of Object.entries(filters)) {
      if (!ALLOWED_FILTERS.has(key)) {
        throw new AppError(`Filtro nao permitido: ${key}`, 400);
      }

      if (value === undefined || value === null || value === "") {
        continue;
      }

      payload[key] = this.normalizePositiveInteger(value, key);
    }

    return payload;
  }

  buildPayload(data) {
    const payload = {};

    for (const [key, value] of Object.entries(data)) {
      if (!ALLOWED_FIELDS.has(key)) {
        throw new AppError(`Campo nao permitido: ${key}`, 400);
      }

      payload[key] = this.normalizePositiveInteger(value, key);
    }

    return payload;
  }

  async validateLivroAndAutor(payload) {
    if (payload.id_livro !== undefined) {
      const livro = await this.repository.findLivroById(payload.id_livro);
      if (!livro) {
        throw new AppError("Livro nao encontrado", 404);
      }
    }

    if (payload.id_autor !== undefined) {
      const autor = await this.repository.findAutorById(payload.id_autor);
      if (!autor) {
        throw new AppError("Autor nao encontrado", 404);
      }
    }
  }

  parseCompositeId(id) {
    if (!id) {
      throw new AppError("ID e obrigatorio", 400);
    }

    const parts = String(id).split("-");
    if (parts.length !== 2) {
      throw new AppError("ID deve estar no formato id_livro-id_autor", 400);
    }

    return {
      id_livro: this.normalizePositiveInteger(parts[0], "id_livro"),
      id_autor: this.normalizePositiveInteger(parts[1], "id_autor"),
    };
  }

  normalizePositiveInteger(value, fieldName) {
    const numericValue = Number(value);

    if (!Number.isInteger(numericValue) || numericValue <= 0) {
      throw new AppError(`${fieldName} invalido`, 400);
    }

    return numericValue;
  }

  formatCompositeId(data) {
    return `${data.id_livro}-${data.id_autor}`;
  }
}

export default LivroAutorService;
