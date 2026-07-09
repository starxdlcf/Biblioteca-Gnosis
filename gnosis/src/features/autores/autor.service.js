import { AppError } from "../../errors/AppError.js";
import { BaseService } from "../../base/base.service.js";
import { AutorRepository } from "./autor.repository.js";

const ALLOWED_FIELDS = new Set(["nome"]);

export class AutorService extends BaseService {
  constructor(repository = new AutorRepository()) {
    super(repository);
  }

  async getAll(filters = {}) {
    try {
      const nome = filters.nome === undefined ? "" : String(filters.nome).trim();

      if (!nome) {
        return super.getAll();
      }

      return await this.repository.findByNome(nome);
    } catch (error) {
      throw new AppError("Erro ao buscar registros", 500);
    }
  }

  async create(data) {
    this.validateBody(data, "Dados obrigatorios nao fornecidos");
    const payload = this.buildPayload(data, true);

    return super.create(payload);
  }

  async update(id, data) {
    this.validateBody(data, "Dados para atualizacao nao fornecidos", true);
    const payload = this.buildPayload(data, false);

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

      const livrosVinculados = await this.repository.countLivrosPorAutor(id);
      if (livrosVinculados > 0) {
        throw new AppError(
          `Nao e possivel excluir o autor. Existem ${livrosVinculados} livro(s) vinculado(s) a ele.`,
          409
        );
      }

      return await this.repository.delete(id);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao deletar registro", 500);
    }
  }

  validateBody(data, message, requireNotEmpty = false) {
    if (!data) {
      throw new AppError(message, 400);
    }

    if (typeof data !== "object" || Array.isArray(data)) {
      throw new AppError("O corpo da requisicao deve ser um objeto", 400);
    }

    if (requireNotEmpty && Object.keys(data).length === 0) {
      throw new AppError(message, 400);
    }
  }

  buildPayload(data, requireNome) {
    for (const field of Object.keys(data)) {
      if (!ALLOWED_FIELDS.has(field)) {
        throw new AppError(`Campo nao permitido: ${field}`, 400);
      }
    }

    const payload = {};

    if (Object.prototype.hasOwnProperty.call(data, "nome")) {
      const nome = data.nome === null || data.nome === undefined
        ? ""
        : data.nome.toString().trim();

      if (!nome) {
        throw new AppError("Nome do autor e obrigatorio", 400);
      }

      payload.nome = nome;
    }

    if (requireNome && !payload.nome) {
      throw new AppError("Nome do autor e obrigatorio", 400);
    }

    return payload;
  }
}

export default AutorService;
