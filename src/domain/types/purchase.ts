import type { ComercialItem } from "./comercialItem";
import type { PaymentStatus, SalePurchaseStatus } from "./common";

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
