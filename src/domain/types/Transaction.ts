export type TransactionType = "in" | "out"; // Income or expense

// Origin determines behavior: sale/purchase link to entities, manual are standalone
export type TransactionOrigin = "sale" | "purchase" | "manual";
