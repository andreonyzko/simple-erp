import type { Service } from "../entities/service";

// `active` is auto-generated on creation (always starts as true)
export type CreateServiceDTO = Omit<Service, "id" | "active">;
export type UpdateServiceDTO = Partial<Omit<Service, "id" | "active">>;
