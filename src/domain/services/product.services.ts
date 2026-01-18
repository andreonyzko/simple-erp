import { assert } from "../rules/common.rules";
import type { Product } from "../types";
import type { ProductRepository } from "./types";

export interface CreateProductInput {
  name: string;
  supplierId?: number;
  stockControl: boolean;
  stock?: number;
  cost?: number;
  sellPrice?: number;
  notes?: string;
}

export interface UpdateProductInput {
  id: number;
  name?: string;
  supplierId?: number;
  cost?: number;
  sellPrice?: number;
  notes?: string;
}

export interface AdjustStockManuallyInput {
  productId: number;
  newStock: number;
}

export async function createProduct(
  input: CreateProductInput,
  deps: { productRepo: ProductRepository }
): Promise<Product> {
  assert(input.name.trim().length > 0, "Product name is required!");

  if (input.stockControl) {
    assert(
      typeof input.stock === "number",
      "Stock is reqeuired when stockControl is enabled"
    );
  }
  assert(input.stock! >= 0, "Stock cannot be negative");

  const product: Product = {
    id: 0,
    name: input.name,
    supplierId: input.supplierId,
    stockControl: input.stockControl,
    stock: input.stockControl ? input.stock ?? 0 : undefined,
    cost: input.cost,
    sellPrice: input.sellPrice,
    active: true,
    notes: input.notes,
  };

  return await deps.productRepo.create(product);
}

export async function updateProduct(
  input: UpdateProductInput,
  deps: { productRepo: ProductRepository }
): Promise<Product> {
  const product = await deps.productRepo.findById(input.id);
  assert(!!product, "Product not found");

  const updatedProduct: Product = {
    ...product!,
    ...input,
  };

  await deps.productRepo.update(updatedProduct);
  return updatedProduct;
}

export async function deactivateService(
  productId: number,
  deps: { productRepo: ProductRepository }
): Promise<void> {
  const product = await deps.productRepo.findById(productId);
  assert(!!product, "Product not found!");

  await deps.productRepo.update({ ...product!, active: false });
}

export async function activateProduct(
  productId: number,
  deps: { productRepo: ProductRepository }
): Promise<void> {
  const product = await deps.productRepo.findById(productId);
  assert(!!product, "Product not found!");

  await deps.productRepo.update({ ...product!, active: true });
}

export async function adjustStockManually(
  input: AdjustStockManuallyInput,
  deps: { productRepo: ProductRepository }
): Promise<void> {
    const product = await deps.productRepo.findById(input.productId);
    assert(!!product, "Product not found");
    assert(product!.stockControl, "Product does not control stock");
    assert(input.newStock >= 0, "Stock cannot be negative");

    await deps.productRepo.update({...product!, stock: input.newStock});
}
