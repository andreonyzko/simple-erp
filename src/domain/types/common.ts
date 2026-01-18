export type PaymentMethods =
  | "pix"
  | "cash"
  | "ted"
  | "boleto"
  | "debit_card"
  | "credit_card";
export type PaymentStatus = "pending" | "partial" | "paid";
export type TransactionType = "in" | "out";
export type TransactionOrigin = "sale" | "purchase" | "manual";
export type ComercialItemType = "product" | "service";
export type SalePurchaseStatus = "open" | "closed" | "canceled";