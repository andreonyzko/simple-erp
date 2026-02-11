// DERIVED: PaymentStatus is NEVER persisted (always calculated from Transactions)
export type PaymentStatus = "pending" | "partial" | "paid";

export type PaymentMethods =
  | "pix"
  | "cash"
  | "ted"
  | "boleto"
  | "debit_card"
  | "credit_card";
