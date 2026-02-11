import type { Transaction } from "../entities/transaction";

// Transactions are IMMUTABLE (no UpdateTransactionDTO exists)
export type CreateTransactionDTO = Omit<Transaction, "id">;
