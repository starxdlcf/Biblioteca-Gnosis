import { AppError } from "../../errors/AppError.js";
import { BaseService } from "../../base/base.service.js";
import { MultaRepository } from "./multa.repository.js";

const ALLOWED_FILTERS = new Set(["id_multa", "id_emprestimo", "pago"]);
const CREATE_ALLOWED_FIELDS = new Set(["id_emprestimo", "dias_atraso", "pago"]);
const UPDATE_ALLOWED_FIELDS = new Set(["id_emprestimo", "dias_atraso", "pago"]);

export class MultaService extends BaseService {
  constructor(repository = new MultaRepository()) {
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

  async create(data) {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new AppError("Dados obrigatorios nao fornecidos", 400);
    }

    const payload = this.buildPayload(data, CREATE_ALLOWED_FIELDS);

    if (payload.id_emprestimo === undefined) {
      throw new AppError("id_emprestimo e obrigatorio", 400);
    }

    if (payload.dias_atraso === undefined) {
      throw new AppError("dias_atraso e obrigatorio", 400);
    }

    const emprestimo = await this.repository.findEmprestimoById(payload.id_emprestimo);
    if (!emprestimo) {
      throw new AppError("Emprestimo nao encontrado", 404);
    }

    const multaExistente = await this.repository.findByEmprestimoId(payload.id_emprestimo);
    if (multaExistente) {
      throw new AppError("Ja existe multa para este emprestimo", 400);
    }

    payload.valor_total = this.calculateValorTotal(payload.dias_atraso);

    return super.create(payload);
  }

  async update(id, data = {}) {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new AppError("Dados para atualizacao invalidos", 400);
    }

    if (Object.keys(data).length === 0) {
      throw new AppError("Dados para atualizacao nao fornecidos", 400);
    }

    if (Object.prototype.hasOwnProperty.call(data, "valor_total")) {
      throw new AppError("valor_total deve ser calculado automaticamente", 400);
    }

    const id_multa = this.normalizePositiveInteger(id, "id_multa");
    const payload = this.buildPayload(data, UPDATE_ALLOWED_FIELDS);

    if (payload.id_emprestimo !== undefined) {
      const emprestimo = await this.repository.findEmprestimoById(payload.id_emprestimo);
      if (!emprestimo) {
        throw new AppError("Emprestimo nao encontrado", 404);
      }

      const multaExistente = await this.repository.findByEmprestimoId(payload.id_emprestimo);
      if (multaExistente && Number(multaExistente.id_multa) !== id_multa) {
        throw new AppError("Ja existe multa para este emprestimo", 400);
      }
    }

    if (payload.dias_atraso !== undefined) {
      payload.valor_total = this.calculateValorTotal(payload.dias_atraso);
    }

    return super.update(id_multa, payload);
  }

  buildFilterPayload(filters) {
    const payload = {};

    if (!filters || typeof filters !== "object") {
      return payload;
    }

    for (const [key, value] of Object.entries(filters)) {
      if (!ALLOWED_FILTERS.has(key) || value === undefined || value === null || value === "") {
        continue;
      }

      if (key === "id_multa" || key === "id_emprestimo") {
        payload[key] = this.normalizePositiveInteger(value, key);
        continue;
      }

      payload[key] = this.normalizeBoolean(value, key);
    }

    return payload;
  }

  buildPayload(data, allowedFields) {
    const payload = {};

    for (const [key, value] of Object.entries(data)) {
      if (!allowedFields.has(key) || value === undefined) {
        continue;
      }

      if (key === "id_emprestimo") {
        payload[key] = this.normalizePositiveInteger(value, key);
        continue;
      }

      if (key === "dias_atraso") {
        payload[key] = this.normalizeNonNegativeInteger(value, key);
        continue;
      }

      payload[key] = this.normalizeBoolean(value, key);
    }

    return payload;
  }

  normalizePositiveInteger(value, fieldName) {
    const numericValue = Number(value);

    if (!Number.isInteger(numericValue) || numericValue <= 0) {
      throw new AppError(`${fieldName} invalido`, 400);
    }

    return numericValue;
  }

  normalizeNonNegativeInteger(value, fieldName) {
    const numericValue = Number(value);

    if (!Number.isInteger(numericValue) || numericValue < 0) {
      throw new AppError(`${fieldName} invalido`, 400);
    }

    return numericValue;
  }

  normalizeBoolean(value, fieldName) {
    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "string") {
      const normalizedValue = value.trim().toLowerCase();
      if (normalizedValue === "true") return true;
      if (normalizedValue === "false") return false;
    }

    throw new AppError(`${fieldName} deve ser boolean`, 400);
  }

  calculateValorTotal(dias_atraso) {
    return dias_atraso;
  }
}

export default MultaService;
