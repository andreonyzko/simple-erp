import type {
    CalendarEvent,
  Client,
  Product,
  Purchase,
  Sale,
  Service,
  Supplier,
  Transaction,
} from "../types";

export interface Repository<T> {
  findById(id: number): Promise<T | null>;
  create(object: T): Promise<T>;
  update(object: T): Promise<T>;
}

export type CalendarRepository = Repository<CalendarEvent> & {
    deleteById(id: number): Promise<void>;
};
export type SaleRepository = Repository<Sale>;
export type PurchaseRepository = Repository<Purchase>;
export type ProductRepository = Repository<Product>;
export type ServiceRepository = Repository<Service>;
export type ClientRepository = Repository<Client>;
export type SupplierRepository = Repository<Supplier>;
export type TransactionRepository = Repository<Transaction> & {
  findByReference(
    origin: Transaction["origin"],
    referenceId: number
  ): Promise<Transaction[]>;
};
