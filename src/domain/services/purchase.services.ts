import { assert } from "../rules/common.rules";
import { calculatePaymentStatus, canReceivePayment } from "../rules/payment.rules";
import {
  calculatePurchaseTotal,
  validatePurchase,
} from "../rules/purchase.rules";
import { validateTransaction } from "../rules/transaction.rules";
import type { ComercialItem, PaymentMethods, Purchase, Transaction } from "../types";
import type { PurchaseRepository, TransactionRepository } from "./types";

export interface CreatePurchaseInput {
  supplierId?: number;
  items?: ComercialItem[];
  totalValue?: number;
  affectStock: boolean;
  notes?: string;
  date?: Date;
}

export interface AddPaymentToPurchaseInput {
  purchaseId: number;
  value: number;
  method: PaymentMethods;
  date?: Date;
  description?: string;
}

export async function createPurchase(
  input: CreatePurchaseInput,
  deps: { purchaseRepo: PurchaseRepository }
): Promise<Purchase> {
  const items = input.items ?? [];
  const calculatedTotal = calculatePurchaseTotal(items);
  const totalValue =
    input.totalValue !== undefined ? input.totalValue : calculatedTotal;

  const purchase: Purchase = {
    id: 0,
    supplierId: input.supplierId,
    items,
    totalValue,
    affectStock: input.affectStock,
    paymentStatus: "pending",
    status: "open",
    date: input.date ?? new Date(),
    notes: input.notes,
  };
  validatePurchase(purchase);

  return await deps.purchaseRepo.create(purchase);
}

export async function addPaymentToPurchase(
  input: AddPaymentToPurchaseInput,
  deps: {
    purchaseRepo: PurchaseRepository;
    transactionRepo: TransactionRepository;
  }
): Promise<Purchase> {
    const purchase = await deps.purchaseRepo.findById(input.purchaseId);
    assert(!!purchase, "Purchase not found");
    assert(canReceivePayment(purchase!.status), "Cannot receive payment for this purchase");
    
    const transaction: Transaction = {
        id: 0,
        title: `Pagamento da compra #${purchase!.id}`,
        description: input.description,
        origin: "purchase",
        referenceId: purchase!.id,
        type: "out",
        value: input.value,
        method: input.method,
        date: input.date ?? new Date()
    }
    validateTransaction(transaction);
    await deps.transactionRepo.create(transaction);

    const existingPayments = await deps.transactionRepo.findByReference("purchase", purchase!.id);
    const paymentValues = existingPayments.map(transaction => transaction.value);
    const paymentStatus = calculatePaymentStatus(purchase!.totalValue, paymentValues);
    
    const updatedPurchase: Purchase = {
        ...purchase!,
        paymentStatus
    }

    await  deps.purchaseRepo.update(updatedPurchase);
    return updatedPurchase;
};
