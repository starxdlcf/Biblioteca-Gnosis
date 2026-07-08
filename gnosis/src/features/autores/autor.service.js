import { AppError } from "../../errors/AppError.js";
import { BaseService } from "../../base/base.service.js";
import { AutorRepository } from "./autor.repository.js";

const ALLOWED_FIELDS = new Set(["nome"]);

export class AutorService extends BaseService {
  constructor(repository = new AutorRepository()) {
    super(repository);
  }

  async create(data) {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new AppError("Dados obrigatorios nao fornecidos", 400);
    }

    const payload = this.buildPayload(data);

    if (!payload.nome) {
      throw new AppError("Nome do autor e obrigatorio", 400);
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

    const payload = this.buildPayload(data);

    if (!payload.nome) {
      throw new AppError("Nome do autor e obrigatorio", 400);
    }

    return super.update(id, payload);
  }

  buildPayload(data) {
    const payload = {};

    for (const [key, value] of Object.entries(data)) {
      if (!ALLOWED_FIELDS.has(key)) {
        throw new AppError(`Campo nao permitido: ${key}`, 400);
      }

      if (key === "nome") {
        const nome = value?.toString().trim();
        if (!nome) {
          throw new AppError("Nome do autor e obrigatorio", 400);
        }

        payload.nome = nome;
      }
    }

    return payload;
  }
}

export default AutorService;
