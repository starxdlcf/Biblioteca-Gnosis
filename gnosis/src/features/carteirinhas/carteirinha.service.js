import { AppError } from "../../errors/AppError.js";
import { BaseService } from "../../base/base.service.js";
import { CarteirinhaRepository } from "./carteirinha.repository.js";

const ALLOWED_FIELDS = new Set(["nome", "email", "telefone"]);

export class CarteirinhaService extends BaseService {
  constructor(repository = new CarteirinhaRepository()) {
    super(repository);
  }

  async create(data) {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new AppError("Dados obrigatorios nao fornecidos", 400);
    }

    const payload = this.buildPayload(data);

    if (!payload.nome) {
      throw new AppError("Nome e obrigatorio", 400);
    }

    if (!payload.email) {
      throw new AppError("E-mail e obrigatorio", 400);
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

    return super.update(id, payload);
  }

  buildPayload(data) {
    const payload = {};

    for (const [key, value] of Object.entries(data)) {
      if (!ALLOWED_FIELDS.has(key)) {
        throw new AppError(`Campo nao permitido: ${key}`, 400);
      }

      if (key === "nome") {
        payload.nome = this.normalizeRequiredText(value, "Nome");
        continue;
      }

      if (key === "email") {
        payload.email = this.normalizeEmail(value);
        continue;
      }

      payload.telefone = this.normalizeRequiredText(value, "Telefone");
    }

    return payload;
  }

  normalizeRequiredText(value, fieldName) {
    const normalizedValue = value?.toString().trim();

    if (!normalizedValue) {
      throw new AppError(`${fieldName} nao pode ser vazio`, 400);
    }

    return normalizedValue;
  }

  normalizeEmail(value) {
    const email = value?.toString().trim().toLowerCase();

    if (!email) {
      throw new AppError("E-mail nao pode ser vazio", 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new AppError("E-mail invalido", 400);
    }

    return email;
  }
}

export default CarteirinhaService;
