import type { ComercialItem } from "./comercialItem";
import type { PaymentStatus, SalePurchaseStatus } from "./common";

export type Sale = {
  id: number;
  clientId: number;
  items: ComercialItem[];
  affectStock: boolean;
  totalValue: number;
  paymentStatus: PaymentStatus;
  status: SalePurchaseStatus;
  date: Date;
  notes?: string;
};