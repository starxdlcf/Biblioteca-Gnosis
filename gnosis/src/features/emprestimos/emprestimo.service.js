import { AppError } from "../../errors/AppError.js";
import { BaseService } from "../../base/base.service.js";
import { EmprestimoRepository } from "./emprestimo.repository.js";
import { MultaRepository } from "../multas/multa.repository.js";

const ALLOWED_FIELDS = new Set([
  "id_carteirinha",
  "id_livro",
  "data_emprestimo",
  "data_devolucao_prevista",
]);

const UPDATE_ALLOWED_FIELDS = new Set([
  "id_carteirinha",
  "id_livro",
  "data_emprestimo",
  "data_devolucao_prevista",
]);

const ALLOWED_FILTERS = new Set([
  "id_emprestimo",
  "id_livro",
  "id_carteirinha",
  "data_devolucao_prevista",
]);

export class EmprestimoService extends BaseService {
  constructor(repository = new EmprestimoRepository(), multaRepository = new MultaRepository()) {
    super(repository);
    this.multaRepository = multaRepository;
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

    if (Object.prototype.hasOwnProperty.call(data, "data_devolucao_real")) {
      throw new AppError("data_devolucao_real deve ser preenchida automaticamente pelo sistema", 400);
    }

    const payload = this.buildPayload(data);

    if (payload.id_carteirinha === undefined) {
      throw new AppError("id_carteirinha e obrigatorio", 400);
    }

    if (payload.id_livro === undefined) {
      throw new AppError("id_livro e obrigatorio", 400);
    }

    const carteirinha = await this.repository.findCarteirinhaById(payload.id_carteirinha);
    if (!carteirinha) {
      throw new AppError("Carteirinha nao encontrada", 404);
    }

    const possuiMultaPendente = await this.multaRepository.existsPendingByCarteirinha(
      payload.id_carteirinha
    );
    if (possuiMultaPendente) {
      throw new AppError(
        "A carteirinha possui multas pendentes e nao pode realizar novos emprestimos.",
        400
      );
    }

    const livro = await this.repository.findLivroById(payload.id_livro);
    if (!livro) {
      throw new AppError("Livro nao encontrado", 404);
    }

    return super.create(payload);
  }

  async update(id, data = {}) {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new AppError("Dados para atualizacao invalidos", 400);
    }

    if (Object.prototype.hasOwnProperty.call(data, "data_devolucao_real")) {
      throw new AppError("data_devolucao_real deve ser preenchida automaticamente pelo sistema", 400);
    }

    const shouldReturn = Object.prototype.hasOwnProperty.call(data, "devolver");
    if (shouldReturn && data.devolver !== true) {
      throw new AppError("devolver deve ser true para registrar a devolucao", 400);
    }

    const payload = this.buildPayload(data, UPDATE_ALLOWED_FIELDS);

    if (Object.keys(payload).length === 0 && !shouldReturn) {
      throw new AppError("Dados para atualizacao nao fornecidos", 400);
    }

    if (payload.id_carteirinha !== undefined) {
      const carteirinha = await this.repository.findCarteirinhaById(payload.id_carteirinha);
      if (!carteirinha) {
        throw new AppError("Carteirinha nao encontrada", 404);
      }
    }

    if (payload.id_livro !== undefined) {
      const livro = await this.repository.findLivroById(payload.id_livro);
      if (!livro) {
        throw new AppError("Livro nao encontrado", 404);
      }
    }

    if (shouldReturn) {
      payload.data_devolucao_real = this.getCurrentDate();
    }

    const emprestimoAtualizado = await super.update(id, payload);

    if (shouldReturn) {
      await this.createMultaIfLate(emprestimoAtualizado);
    }

    return emprestimoAtualizado;
  }

  buildFilterPayload(filters) {
    const payload = {};

    if (!filters || typeof filters !== "object") {
      return payload;
    }

    for (const [key, value] of Object.entries(filters)) {
      if (!ALLOWED_FILTERS.has(key) || value === undefined) {
        continue;
      }

      if (value === null || value === "") {
        continue;
      }

      if (key === "id_emprestimo" || key === "id_carteirinha" || key === "id_livro") {
        payload[key] = this.normalizeInteger(value, key);
        continue;
      }

      payload[key] = this.normalizeDate(value, key);
    }

    return payload;
  }

  buildPayload(data, allowedFields = ALLOWED_FIELDS) {
    const payload = {};

    for (const [key, value] of Object.entries(data)) {
      if (!allowedFields.has(key)) {
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
      throw new AppError(`${fieldName} invalido`, 400);
    }

    return numericValue;
  }

  normalizeDate(value, fieldName) {
    if (typeof value === "string") {
      const trimmedValue = value.trim();
      if (!trimmedValue) {
        throw new AppError(`${fieldName} nao pode ser vazio`, 400);
      }

      const parsedDate = new Date(trimmedValue);
      if (Number.isNaN(parsedDate.getTime())) {
        throw new AppError(`${fieldName} invalida`, 400);
      }

      return parsedDate.toISOString().slice(0, 10);
    }

    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) {
        throw new AppError(`${fieldName} invalida`, 400);
      }
      return value.toISOString().slice(0, 10);
    }

    throw new AppError(`${fieldName} invalida`, 400);
  }

  getCurrentDate() {
    return new Date().toISOString().slice(0, 10);
  }

  async createMultaIfLate(emprestimo) {
    const diasAtraso = this.calculateDiasAtraso(
      emprestimo.data_devolucao_prevista,
      emprestimo.data_devolucao_real
    );

    if (diasAtraso <= 0) {
      return;
    }

    const multaExistente = await this.multaRepository.findByEmprestimoId(
      emprestimo.id_emprestimo
    );
    if (multaExistente) {
      return;
    }

    await this.multaRepository.create({
      id_emprestimo: emprestimo.id_emprestimo,
      dias_atraso: diasAtraso,
      valor_total: diasAtraso,
      pago: false,
    });
  }

  calculateDiasAtraso(dataPrevista, dataReal) {
    const prevista = this.getUtcDateOnly(dataPrevista, "data_devolucao_prevista");
    const real = this.getUtcDateOnly(dataReal, "data_devolucao_real");
    const millisecondsPerDay = 24 * 60 * 60 * 1000;

    return Math.floor((real - prevista) / millisecondsPerDay);
  }

  getUtcDateOnly(value, fieldName) {
    const normalizedDate = this.normalizeDate(value, fieldName);
    const [year, month, day] = normalizedDate.split("-").map(Number);

    return Date.UTC(year, month - 1, day);
  }
}

export default EmprestimoService;
