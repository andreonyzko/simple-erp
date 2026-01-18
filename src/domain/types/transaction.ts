import type { PaymentMethods, TransactionOrigin, TransactionType } from "./common";

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