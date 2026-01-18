import type { PaymentStatus, SalePurchaseStatus } from "../types";
import { sum } from "./common.rules";

export function calculatePaymentStatus(totalValue: number, payments : number[]): PaymentStatus {
    const paid = sum(payments);
    if(paid <= 0) return "pending";
    if(paid < totalValue) return "partial";
    return "paid";
}

export function canReceivePayment(status: SalePurchaseStatus): boolean {
    return status === "open";
}