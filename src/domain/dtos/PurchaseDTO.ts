import type { Purchase } from "../entities/purchase";

// `status` is auto-generated on creation (always starts as "open")
// `affectStock` is immutable (cannot be changed after creation)
export type CreatePurchaseDTO = Omit<Purchase, "id" | "status">;
export type UpdatePurchaseDTO = Partial<
  Omit<Purchase, "id" | "status" | "affectStock">
>;
