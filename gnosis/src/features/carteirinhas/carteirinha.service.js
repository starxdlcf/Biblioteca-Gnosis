import { AppError } from "../../errors/AppError.js";
import { BaseService } from "../../base/base.service.js";
import { CarteirinhaRepository } from "./carteirinha.repository.js";

export class CarteirinhaService extends BaseService {
  constructor(repository = new CarteirinhaRepository()) {
    super(repository);
  }

  async create(data) {
    if (!data || typeof data !== "object") {
      throw new AppError("Dados obrigatórios não fornecidos", 400);
    }

    const nome = data.nome?.toString().trim();
    const email = data.email?.toString().trim().toLowerCase();

    if (!nome) {
      throw new AppError("Nome é obrigatório", 400);
    }

    if (!email) {
      throw new AppError("E-mail é obrigatório", 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new AppError("E-mail inválido", 400);
    }

    return super.create({
      ...data,
      nome,
      email,
    });
  }

  async update(id, data) {
    if (!data || typeof data !== "object") {
      throw new AppError("Dados para atualização não fornecidos", 400);
    }

    if (data.nome !== undefined) {
      const nome = data.nome?.toString().trim();
      if (!nome) {
        throw new AppError("Nome não pode ser vazio", 400);
      }
      data.nome = nome;
    }

    if (data.email !== undefined) {
      const email = data.email?.toString().trim().toLowerCase();
      if (!email) {
        throw new AppError("E-mail não pode ser vazio", 400);
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new AppError("E-mail inválido", 400);
      }

      data.email = email;
    }

    return super.update(id, data);
  }
}

export default CarteirinhaService;
