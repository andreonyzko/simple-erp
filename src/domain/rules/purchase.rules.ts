import type { ComercialItem, Purchase } from "../types";
import { assert } from "./common.rules";

export function calculatePurchaseTotal(items: ComercialItem[]): number {
  return items.reduce(
    (total, item) => total + item.unitValue * item.quantity,
    0
  );
}

export function canClosePurchase(purchase: Purchase): boolean {
  return purchase.paymentStatus === "paid";
}

export function validatePurchase(purchase: Purchase): void {
  assert(Number.isFinite(purchase.totalValue), "Invalid purchase total");
  assert(purchase.totalValue >= 0, "Purchase total cannot be negative");
}
