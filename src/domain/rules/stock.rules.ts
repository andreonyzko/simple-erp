import type { ComercialItem, Product } from "../types";
import { assert } from "./common.rules";

export function canChangeStock(product: Product): boolean {
    return product.stockControl;
}

export function calculateNewStockAfterSale(product: Product, item: ComercialItem): number{
    assert(product.stock !== undefined, "Product stock is undefined");

    const newStock = product.stock! - item.quantity;
    assert(newStock >= 0, `Insufficient stock for product ${product.name}`);

    return newStock;
}

export function calculateNewStockAfterPurchase(product: Product, item: ComercialItem): number {
    assert(product.stock !== undefined, "Product stock is undefined");
    return product.stock! + item.quantity;
}