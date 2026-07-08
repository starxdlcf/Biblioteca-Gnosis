import { BaseRepository } from "../../base/base.repository.js";

export class AutorRepository extends BaseRepository {
  constructor() {
    super("autores", "id_autor");
  }
}

export default AutorRepository;
