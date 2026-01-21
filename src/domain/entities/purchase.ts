import type { ComercialItem } from "../types/comercialItem";
import type { PaymentStatus } from "../types/PaymentStatus";
import type { SalePurchaseStatus } from "../types/SalePurchaseStatus";

export type Purchase = {
  id: number;
  supplierId?: number;
  items: ComercialItem[];
  totalValue: number;
  affectStock: boolean;
  paymentStatus: PaymentStatus;
  status: SalePurchaseStatus;
  date: Date;
  notes?: string;
};
