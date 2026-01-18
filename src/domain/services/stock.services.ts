import { assert } from "../rules/common.rules";
import {
  calculateNewStockAfterPurchase,
  calculateNewStockAfterSale,
  canChangeStock,
} from "../rules/stock.rules";
import type { Product } from "../types";
import type { ProductRepository, PurchaseRepository, SaleRepository } from "./types";

export async function applyStockFromSale(
  saleId: number,
  deps: { saleRepo: SaleRepository; productRepo: ProductRepository }
): Promise<void> {
  const sale = await deps.saleRepo.findById(saleId);
  assert(!!sale, "Sale not found");
  if (!sale!.affectStock) return;

  for (const item of sale!.items) {
    if (item.type !== "product") continue;
    const product = await deps.productRepo.findById(item.referenceId);
    assert(!!product, "Product not found");

    if (!canChangeStock(product!)) continue;

    const newStock = calculateNewStockAfterSale(product!, item);

    const updatedProduct: Product = {
      ...product!,
      stock: newStock,
    };

    await deps.productRepo.update(updatedProduct);
  }
}

export async function applyStockFromPurchase(
  purchaseId: number,
  deps: { purchaseRepo: PurchaseRepository; productRepo: ProductRepository }
): Promise<void> {
  const purchase = await deps.purchaseRepo.findById(purchaseId);
  assert(!!purchase, "Purchase not found");
  if (!purchase!.affectStock) return;

  for (const item of purchase!.items) {
    if (item.type !== "product") continue;

    const product = await deps.productRepo.findById(item.referenceId);
    assert(!!product, "Product not found");
    if (!canChangeStock(product!)) continue;

    const newStock = calculateNewStockAfterPurchase(product!, item);
    const updatedProduct: Product = {
      ...product!,
      stock: newStock,
    };

    await deps.productRepo.update(updatedProduct);
  }
}
