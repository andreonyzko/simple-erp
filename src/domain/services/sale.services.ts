import { assert } from "../rules/common.rules";
import {
  calculatePaymentStatus,
  canReceivePayment,
} from "../rules/payment.rules";
import { calculateSaleTotal, canCancelSale, validateSale } from "../rules/sale.rules";
import { validateTransaction } from "../rules/transaction.rules";
import type {
  ComercialItem,
  PaymentMethods,
  Sale,
  Transaction,
} from "../types";
import type { SaleRepository, TransactionRepository } from "./types";

export interface AddPaymentToSaleInput {
  saleId: number;
  value: number;
  method: PaymentMethods;
  date?: Date;
  description?: string;
}

export interface CreateSaleInput {
  clientId: number;
  items?: ComercialItem[];
  totalValue?: number;
  affectStock: boolean;
  notes?: string;
  date?: Date;
}

export async function addPaymentToSale(
  input: AddPaymentToSaleInput,
  deps: { saleRepo: SaleRepository; transactionRepo: TransactionRepository }
): Promise<Sale> {
  // Find sale
  const sale = await deps.saleRepo.findById(input.saleId);
  assert(!!sale, "Sale not found");
  assert(
    canReceivePayment(sale!.status),
    "Cannot receive payment for this sale"
  );

  // Create Transaction
  const transaction: Transaction = {
    id: 0, // repo will generate
    title: `Pagamento da venda #${sale!.id}`,
    description: input.description,
    origin: "sale",
    referenceId: sale!.id,
    type: "in",
    value: input.value,
    method: input.method,
    date: input.date ?? new Date(),
  };
  validateTransaction(transaction);
  await deps.transactionRepo.create(transaction);

  // Update Sale Payment Status
  const existingPayments = await deps.transactionRepo.findByReference(
    "sale",
    sale!.id
  );
  const paymentsValues = existingPayments.map(
    (transaction) => transaction.value
  );
  const paymentStatus = calculatePaymentStatus(
    sale!.totalValue,
    paymentsValues
  );
  const updatedSale: Sale = {
    ...sale!,
    paymentStatus,
  };
  await deps.saleRepo.update(updatedSale);

  return updatedSale;
}

export async function createSale(
  input: CreateSaleInput,
  deps: { saleRepo: SaleRepository }
): Promise<Sale> {
  const items = input.items ?? [];
  const calculatedTotal = calculateSaleTotal(items);
  const totalValue =
    input.totalValue != undefined ? input.totalValue : calculatedTotal;

  const sale: Sale = {
    id: 0,
    clientId: input.clientId,
    items,
    totalValue,
    paymentStatus: "pending",
    status: "open",
    affectStock: input.affectStock,
    date: input.date ?? new Date(),
    notes: input.notes,
  };
  validateSale(sale);

  return await deps.saleRepo.create(sale);
}

export async function cancelSale(
  saleId: number,
  deps: { saleRepo: SaleRepository }
): Promise<Sale> {
  const sale = await deps.saleRepo.findById(saleId);
  assert(!!sale, "Sale not found");
  assert(canCancelSale(sale!), "Cannot cancel a paid sale");

  const canceledSale: Sale = {
    ...sale!,
    status: "canceled",
  }
  await deps.saleRepo.update(canceledSale);

  return canceledSale;
};
