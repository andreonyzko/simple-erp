import type { ComercialItem } from "../types/ComercialItem";
import type { SalePurchaseStatus } from "../types/SalePurchaseStatus";

export type Purchase = {
  id: number;
  supplierId?: number; // Optional: purchase without registered supplier
  items: ComercialItem[]; // Can ONLY include products (services not allowed)
  totalValue: number; // Default: sum of items, but can be manually overridden
  affectStock: boolean; // Immutable: defines if stock is affected (cannot change after creation)
  status: SalePurchaseStatus; // Machine state: open → closed → canceled
  date: Date; // Can be past or future
  notes?: string;
};
