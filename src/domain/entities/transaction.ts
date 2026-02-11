import type { PaymentMethods } from "../types/Payment";
import type { TransactionOrigin } from "../types/Transaction";
import type { TransactionType } from "../types/Transaction";

// IMMUTABLE: Transactions are NEVER edited or deleted (preserves financial history integrity)
// Corrections and cancellations generate NEW corrective Transactions
export type Transaction = {
  id: number;
  title: string;
  description?: string;
  type: TransactionType; // "in" (income) or "out" (expense)
  origin: TransactionOrigin; // "sale", "purchase", or "manual"
  value: number;
  method: PaymentMethods;
  date: Date; // CANNOT be future (validated in Service)
  referenceId?: number; // Links to Sale/Purchase id (undefined for manual)
};
