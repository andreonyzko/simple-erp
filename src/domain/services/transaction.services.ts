import { assert } from "../rules/common.rules";
import { validateTransaction } from "../rules/transaction.rules";
import type { PaymentMethods, Transaction, TransactionType } from "../types";
import type { TransactionRepository } from "./types";

export interface AddManualTransactionInput {
  title: string;
  description?: string;
  value: number;
  type: TransactionType;
  method: PaymentMethods;
  date?: Date;
}

export async function addManualTransaction(
  input: AddManualTransactionInput,
  deps: { transactionRepo: TransactionRepository }
): Promise<Transaction> {
    assert(input.title.trim().length > 0, "Transaction title is required");

    const transaction: Transaction = {
        id: 0, // repo generate
        title: input.title,
        description: input.description,
        origin: "manual",
        type: input.type,
        value: input.value,
        method: input.method,
        date: input.date ?? new Date()
    }
    validateTransaction(transaction);

    return await deps.transactionRepo.create(transaction);
}
