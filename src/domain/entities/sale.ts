import type { ComercialItem } from "../types/comercialItem";
import type { PaymentStatus } from "../types/PaymentStatus";
import type { SalePurchaseStatus } from "../types/SalePurchaseStatus";

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