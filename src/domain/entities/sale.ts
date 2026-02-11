import type { ComercialItem } from "../types/ComercialItem";
import type { SalePurchaseStatus } from "../types/SalePurchaseStatus";

export type Sale = {
  id: number;
  clientId?: number; // Optional: sale without registered client
  items: ComercialItem[]; // Can include products and/or services
  affectStock: boolean; // Immutable: defines if stock is affected (cannot change after creation)
  totalValue: number; // Default: sum of items, but can be manually overridden
  status: SalePurchaseStatus; // Machine state: open → closed → canceled
  date: Date; // Can be past or future
  notes?: string;
};
