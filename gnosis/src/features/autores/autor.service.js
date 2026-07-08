import { AppError } from "../../errors/AppError.js";
import { BaseService } from "../../base/base.service.js";
import { AutorRepository } from "./autor.repository.js";
import { LivroAutorRepository } from "../livro_autor/livro_autor.repository.js";

const ALLOWED_FIELDS = new Set(["nome"]);

export class AutorService extends BaseService {
  constructor(repository = new AutorRepository(), livroAutorRepository = new LivroAutorRepository()) {
    super(repository);
    this.livroAutorRepository = livroAutorRepository;
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

  async delete(id) {
    try {
      if (!id) {
        throw new AppError("ID e obrigatorio", 400);
      }

      const existing = await this.repository.findById(id);
      if (!existing) {
        throw new AppError("Registro nao encontrado", 404);
      }

      const hasLinkedBooks = await this.livroAutorRepository.existsByAutor(id);
      if (hasLinkedBooks) {
        throw new AppError(
          "Não é possível excluir o autor, pois existem livros vinculados a ele.",
          400
        );
      }

      return await this.repository.delete(id);
    } catch (error) {
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
