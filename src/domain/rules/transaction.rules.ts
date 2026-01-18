import type { Transaction, TransactionOrigin, TransactionType } from "../types";
import { assert, isPositive } from "./common.rules";

export function validateTransaction(transaction: Transaction): void {
    assert(isPositive(transaction.value), "Transaction value must be positive");
}

export function inferTransactionTypeFromOrigin(origin: TransactionOrigin): TransactionType | null{
    if(origin === "sale") return "in";
    if(origin === "purchase") return "out";
    return null;
}