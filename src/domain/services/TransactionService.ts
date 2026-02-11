import type { CreateTransactionDTO } from "../dtos/TransactionDTO";
import type { Transaction } from "../entities/transaction";
import { transactionRepository } from "../repositories/TransactionRepository";
import type { TransactionOrigin } from "../types/Transaction";
import type { TransactionType } from "../types/Transaction";

type TransactionFilters = {
  text?: string;
  origin?: TransactionOrigin;
  type?: TransactionType;
  value?: {
    min: number;
    max?: number;
  };
  dateRange: {
    start: Date;
    end: Date;
  };
};

class TransactionService {
  async createManual(data: CreateTransactionDTO): Promise<number> {
    // Force manual origin and clear referenceId (manual transactions are standalone)
    data = { ...data, origin: "manual", referenceId: undefined };

    // Build full entity to apply business rules before persist
    const transaction: Transaction = {
      ...data,
      id: 0,
    };

    this.validateRules(transaction);
    return await transactionRepository.create(data);
  }

  async list(filters: TransactionFilters): Promise<Transaction[]> {
    // 1. Apply indexed filter by period (always present)
    let transactions = await transactionRepository.listByPeriod(
      filters.dateRange.start,
      filters.dateRange.end
    );

    // 2. Filter by origin
    if (filters.origin !== undefined)
      transactions = transactions.filter((t) => t.origin === filters.origin);

    // 3. Filter by type
    if (filters.type !== undefined)
      transactions = transactions.filter((t) => t.type === filters.type);

    // 4. Filter by value range
    if (filters.value?.min !== undefined)
      transactions = transactions.filter((t) => t.value >= filters.value!.min);
    if (filters.value?.max !== undefined)
      transactions = transactions.filter((t) => t.value <= filters.value!.max!);

    // 5. Filter by text search (if provided)
    if (filters.text?.trim())
      transactions = transactions.filter((t) =>
        t.title.toLowerCase().includes(filters.text!.toLowerCase())
      );

    return transactions;
  }
  async getById(id: number): Promise<Transaction> {
    return await transactionRepository.findById(id);
  }

  // Calculate cash flow for a period (NEVER persisted)
  async getCashFlow(
    start: Date,
    end: Date
  ): Promise<{ in: number; out: number; balance: number }> {
    const transactions = await transactionRepository.listByPeriod(start, end);

    const flow = transactions.reduce(
      (acc, t) => {
        if (t.type === "in") acc.in += t.value;
        else acc.out += t.value;
        return acc;
      },
      { in: 0, out: 0 }
    );

    return { ...flow, balance: flow.in - flow.out };
  }
  private validateRules(transaction: Transaction) {
    if (!transaction.title.trim())
      throw new Error("O título não pode ser vazio");

    if (transaction.value <= 0)
      throw new Error("O valor deve ser maior que zero");

    if (transaction.date > new Date())
      throw new Error("A data não pode ser futura");

    if (
      transaction.origin === "manual" &&
      transaction.referenceId !== undefined
    )
      throw new Error("Transações manuais não podem ter referenceId");
  }
}
export const transactionService = new TransactionService();
