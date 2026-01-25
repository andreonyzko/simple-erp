import { db } from "../../infra/database";
import type { Transaction } from "../entities/transaction";
import type { TransactionOrigin } from "../types/TransactionOrigin";
import type { TransactionType } from "../types/TransactionType";

export class TransactionRepository {
  // Create
  async create(transaction: Transaction) {
    return await db.transactions.add(transaction);
  }

  // Read
  async findById(id: number) {
    return await db.transactions.get(id);
  }

  async searchByTitle(text: string) {
    return await db.transactions
      .where("title")
      .startsWithIgnoreCase(text)
      .toArray();
  }

  async listByOrigin(origin: TransactionOrigin) {
    return await db.transactions.where("origin").equals(origin).toArray();
  }

  async listByType(type: TransactionType) {
    return await db.transactions.where("type").equals(type).toArray();
  }

  async listByReferenceId(referenceId: number) {
    return await db.transactions
      .where("referenceId")
      .equals(referenceId)
      .toArray();
  }

  async listByPeriod(start: Date, end: Date) {
    return await db.transactions
      .where("date")
      .between(start, end, true, true)
      .toArray();
  }

  async listAll(){
    return await db.transactions.toArray();
  }
}
