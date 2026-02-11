import type { Client, Supplier } from "../entities/person";

// `active` and `createdAt` are auto-generated on creation
export type CreateClientDTO = Omit<Client, "id" | "active" | "createdAt">;
export type UpdateClientDTO = Partial<
  Omit<Client, "id" | "active" | "createdAt">
>;

// `active` and `createdAt` are auto-generated on creation
export type CreateSupplierDTO = Omit<Supplier, "id" | "active" | "createdAt">;
export type UpdateSupplierDTO = Partial<
  Omit<Supplier, "id" | "active" | "createdAt">
>;
