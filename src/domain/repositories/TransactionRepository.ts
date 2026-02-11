import { db } from "../../infra/database";
import type { CreateTransactionDTO } from "../dtos/TransactionDTO";
import type { Transaction } from "../entities/transaction";
import type { TransactionOrigin, TransactionType } from "../types/Transaction";

class TransactionRepository {
  async create(data: CreateTransactionDTO): Promise<number> {
    return await db.transactions.add(data as Transaction);
  }

  // Transactions are IMMUTABLE (no update or delete methods)

  async findById(id: number): Promise<Transaction> {
    const transaction = await db.transactions.get(id);
    if (!transaction) throw new Error("Transação não encontrada");

    return transaction;
  }

  // Search by title (uses indexed field)
  async searchByText(text: string): Promise<Transaction[]> {
    if (!text.trim()) throw new Error("O texto de busca não pode ser vazio");

    return await db.transactions
      .where("title")
      .startsWithIgnoreCase(text)
      .toArray();
  }

  async listByOrigin(origin: TransactionOrigin): Promise<Transaction[]> {
    return await db.transactions.where("origin").equals(origin).toArray();
  }

  async listByType(type: TransactionType): Promise<Transaction[]> {
    return await db.transactions.where("type").equals(type).toArray();
  }

  async listByReferenceId(referenceId: number): Promise<Transaction[]> {
    return await db.transactions
      .where("referenceId")
      .equals(referenceId)
      .toArray();
  }

  async listByReferenceIds(referencesId: number[]): Promise<Transaction[]> {
    return await db.transactions
      .where("referenceId")
      .anyOf(referencesId)
      .toArray();
  }

  async listByPeriod(start: Date, end: Date): Promise<Transaction[]> {
    if (start > end)
      throw new Error("Data inicial não pode ser maior que a final");
    
    return await db.transactions
      .where("date")
      .between(start, end, true, true)
      .toArray();
  }

  async listAll(): Promise<Transaction[]> {
    return await db.transactions.toArray();
  }
}

export const transactionRepository = new TransactionRepository();
