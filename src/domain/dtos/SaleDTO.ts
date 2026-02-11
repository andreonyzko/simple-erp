import type { Sale } from "../entities/sale";

// `status` is auto-generated on creation (always starts as "open")
// `affectStock` is immutable (cannot be changed after creation)
export type CreateSaleDTO = Omit<Sale, "id" | "status">;
export type UpdateSaleDTO = Partial<
  Omit<Sale, "id" | "status" | "affectStock">
>;
