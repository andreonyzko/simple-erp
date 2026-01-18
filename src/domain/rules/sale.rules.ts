import type { ComercialItem, Sale } from "../types";
import { assert } from "./common.rules";

export function calculateSaleTotal(items: ComercialItem[]): number {
    return items.reduce((total, item) => total + item.unitValue * item.quantity, 0);
}

export function canCloseSale(sale: Sale): boolean {
    return sale.paymentStatus === "paid";
}

export function canCancelSale(sale: Sale): boolean {
    return sale.paymentStatus !== "paid";
}

export function validateSale(sale: Sale): void {
    assert(Number.isFinite(sale.totalValue), "Invalid sale total");
    assert(sale.totalValue >= 0, "Sale total cannot be negative");
}