import { BaseRepository } from "../../base/base.repository.js";

export class CarteirinhaRepository extends BaseRepository {
  constructor() {
    super("carteirinha", "id_carteirinha");
  }
}

export default CarteirinhaRepository;
