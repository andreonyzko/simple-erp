import type { PaymentStatus } from "./Payment";
import type { SalePurchaseStatus } from "./SalePurchaseStatus";
import type { StockStatus } from "./Stock";
import type { TransactionOrigin, TransactionType } from "./Transaction";

export type CalendarFilters = {
  search?: string;
  dateRange: {
    start: string;
    end: string;
  };
};

export type ClientFilters = {
  search?: string;
  active?: boolean;
  debts?: {
    min: number;
    max?: number;
  };
};

export type ProductFilters = {
  search?: string;
  stock?: StockStatus;
  cost?: {
    min: number;
    max?: number;
  };
  sellPrice?: {
    min: number;
    max?: number;
  };
  active?: boolean;
};

export type PurchaseFilters = {
  search?: string;
  totalValue?: {
    min: number;
    max?: number;
  };
  paymentStatus?: PaymentStatus;
  status?: SalePurchaseStatus;
  dateRange: {
    start: string;
    end: string;
  };
};

export type SaleFilters = {
  search?: string;
  totalValue?: {
    min: number;
    max?: number;
  };
  paymentStatus?: PaymentStatus;
  status?: SalePurchaseStatus;
  dateRange: {
    start: string;
    end: string;
  };
};

export type ServiceFilters = {
  search?: string;
  price?: {
    min: number;
    max?: number;
  };
  active?: boolean;
};

export type SupplierFilters = {
  search?: string;
  active?: boolean;
  debts?: {
    min: number;
    max?: number;
  };
};

export type TransactionFilters = {
  search?: string;
  origin?: TransactionOrigin;
  type?: TransactionType;
  value?: {
    min: number;
    max?: number;
  };
  dateRange: {
    start: string;
    end: string;
  };
};