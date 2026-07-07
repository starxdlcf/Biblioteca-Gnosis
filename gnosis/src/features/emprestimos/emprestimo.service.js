import { AppError } from "../../errors/AppError.js";
import { BaseService } from "../../base/base.service.js";
import { EmprestimoRepository } from "./emprestimo.repository.js";

const ALLOWED_FIELDS = new Set([
  "id_carteirinha",
  "id_livro",
  "data_emprestimo",
  "data_devolucao_prevista",
  "data_devolucao_real",
]);

export class EmprestimoService extends BaseService {
  constructor(repository = new EmprestimoRepository()) {
    super(repository);
  }

  async create(data) {
    if (!data || typeof data !== "object") {
      throw new AppError("Dados obrigatórios não fornecidos", 400);
    }

    const payload = this.buildPayload(data);

    if (payload.id_carteirinha === undefined) {
      throw new AppError("id_carteirinha é obrigatório", 400);
    }

    if (payload.id_livro === undefined) {
      throw new AppError("id_livro é obrigatório", 400);
    }

    const carteirinha = await this.repository.findCarteirinhaById(payload.id_carteirinha);
    if (!carteirinha) {
      throw new AppError("Carteirinha não encontrada", 404);
    }

    const livro = await this.repository.findLivroById(payload.id_livro);
    if (!livro) {
      throw new AppError("Livro não encontrado", 404);
    }

    return super.create(payload);
  }

  async update(id, data) {
    if (!data || typeof data !== "object") {
      throw new AppError("Dados para atualização não fornecidos", 400);
    }

    const payload = this.buildPayload(data);

    if (Object.keys(payload).length === 0) {
      throw new AppError("Dados para atualização não fornecidos", 400);
    }

    if (payload.id_carteirinha !== undefined) {
      const carteirinha = await this.repository.findCarteirinhaById(payload.id_carteirinha);
      if (!carteirinha) {
        throw new AppError("Carteirinha não encontrada", 404);
      }
    }

    if (payload.id_livro !== undefined) {
      const livro = await this.repository.findLivroById(payload.id_livro);
      if (!livro) {
        throw new AppError("Livro não encontrado", 404);
      }
    }

    return super.update(id, payload);
  }

  buildPayload(data) {
    const payload = {};

    for (const [key, value] of Object.entries(data)) {
      if (!ALLOWED_FIELDS.has(key)) {
        continue;
      }

      if (value === undefined) {
        continue;
      }

      if (key === "id_carteirinha" || key === "id_livro") {
        payload[key] = this.normalizeInteger(value, key);
        continue;
      }

      if (value === null) {
        payload[key] = null;
        continue;
      }

      payload[key] = this.normalizeDate(value, key);
    }

    return payload;
  }

  normalizeInteger(value, fieldName) {
    const numericValue = Number(value);

    if (!Number.isInteger(numericValue) || numericValue <= 0) {
      throw new AppError(`${fieldName} inválido`, 400);
    }

    return numericValue;
  }

  normalizeDate(value, fieldName) {
    if (typeof value === "string") {
      const trimmedValue = value.trim();
      if (!trimmedValue) {
        throw new AppError(`${fieldName} não pode ser vazio`, 400);
      }

      const parsedDate = new Date(trimmedValue);
      if (Number.isNaN(parsedDate.getTime())) {
        throw new AppError(`${fieldName} inválida`, 400);
      }

      return parsedDate.toISOString().slice(0, 10);
    }

    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) {
        throw new AppError(`${fieldName} inválida`, 400);
      }
      return value.toISOString().slice(0, 10);
    }

    throw new AppError(`${fieldName} inválida`, 400);
  }
}

export default EmprestimoService;
