import type { Product } from "../entities/product";

// `active` is auto-generated on creation (always starts as true)
export type CreateProductDTO = Omit<Product, "id" | "active">;
export type UpdateProductDTO = Partial<Omit<Product, "id" | "active">>;
