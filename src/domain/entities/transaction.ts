import type { PaymentMethods } from "../types/PaymentMethods";
import type { TransactionOrigin } from "../types/TransactionOrigin";
import type { TransactionType } from "../types/TransactionType";

export type Transaction = {
  id: number;
  title: string;
  description?: string;
  type: TransactionType;
  origin: TransactionOrigin;
  value: number;
  method: PaymentMethods;
  date: Date;
  referenceId?: number;
};