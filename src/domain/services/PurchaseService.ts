import type { CreatePurchaseDTO, UpdatePurchaseDTO } from "../dtos/PurchaseDTO";
import type { CreateTransactionDTO } from "../dtos/TransactionDTO";
import type { Product } from "../entities/product";
import type { Purchase } from "../entities/purchase";
import type { Transaction } from "../entities/transaction";
import { productRepository } from "../repositories/ProductRepository";
import { purchaseRepository } from "../repositories/PurchaseRepository";
import { supplierRepository } from "../repositories/SupplierRepository";
import { transactionRepository } from "../repositories/TransactionRepository";
import type { ComercialItem } from "../types/ComercialItem";
import type { PaymentStatus } from "../types/Payment";
import type { SalePurchaseStatus } from "../types/SalePurchaseStatus";

type PurchaseFilters = {
  search?: string;
  totalValue?: {
    min: number;
    max?: number;
  };
  paymentStatus?: PaymentStatus;
  status?: SalePurchaseStatus;
  dateRange: {
    start: string;
    end: string;
  };
};

type StockChanges = { productId: number; quantity: number };
export type PurchaseWithPayStatus = Purchase & { paymentStatus: string };

class PurchaseService {
  async create(
    data: CreatePurchaseDTO,
    initialTransactions: Transaction[]
  ): Promise<number> {
    // Build full entity to validate before persist
    const purchase: Purchase = {
      ...data,
      id: 0,
      status: "open",
    };
    await this.validateRules(purchase); // Apply stock changes if needed (increase product quantities)
    if (data.affectStock) {
      const stockChanges: StockChanges[] = data.items.map((i) => ({
        productId: i.referenceId,
        quantity: i.quantity,
      }));
      await this.applyStockChanges(stockChanges);
    }

    const purchaseId = await purchaseRepository.create(data);

    // Register initial payments (if any)
    for (const t of initialTransactions) await this.addPayment(purchaseId, t);

    return purchaseId;
  }
  async update(id: number, data: UpdatePurchaseDTO): Promise<number> {
    const current = await purchaseRepository.findById(id);

    // Merge preserving immutable fields (id, status, affectStock)
    const updated: Purchase = {
      ...current,
      ...data,
      id: current.id,
      status: current.status,
    };

    // Validate state transitions and apply business rules
    switch (current.status) {
      case "open":
        await this.validateRules(updated);
        // Recalculate stock if items changed
        if (data.items && current.affectStock) {
          const stockChanges = this.calculateStockDiff(
            current.items,
            data.items
          );
          if (stockChanges.length > 0)
            await this.applyStockChanges(stockChanges);
        }
        break;
      case "closed":
        // Only notes can be edited
        if (Object.keys(data).some((key) => key !== "notes"))
          throw new Error("Compras fechadas só podem ter notas editadas");
        break;

      case "canceled":
        throw new Error("Não é possível editar compras canceladas");
    }

    return await purchaseRepository.update(id, data);
  }
  async close(id: number): Promise<number> {
    const purchase = await purchaseRepository.findById(id);
    if (purchase.status === "closed")
      throw new Error("Essa compra já está fechada");
    if (purchase.status === "canceled")
      throw new Error("A compra foi cancelada e não pode ser fechada");
    return await purchaseRepository.updateStatus(id, "closed");
  }
  async cancel(id: number): Promise<number> {
    const purchase = await purchaseRepository.findById(id);
    if (purchase.status === "canceled")
      throw new Error("Essa compra já foi cancelada");

    // 1. Create corrective Transaction (refund)
    const transactions = (
      await transactionRepository.listByReferenceId(id)
    ).filter((t) => t.origin === "purchase" && t.type === "out");
    const totalTransactions = transactions.reduce(
      (total, t) => total + t.value,
      0
    );

    const corrective: CreateTransactionDTO = {
      title: `Estorno da compra #${id}`,
      description: "Motivo: cancelamento da compra",
      origin: "purchase",
      type: "in",
      date: new Date(),
      referenceId: id,
      value: totalTransactions,
      method: transactions[0].method,
    };

    await transactionRepository.create(corrective);

    // 2. Revert stock changes (remove product quantities)
    if (purchase.affectStock) {
      const stockChanges = purchase.items.map((i) => ({
        productId: i.referenceId,
        quantity: -i.quantity,
      }));
      await this.applyStockChanges(stockChanges);
    }

    return await purchaseRepository.updateStatus(id, "canceled");
  }
  async addPayment(
    purchaseId: number,
    transaction: Transaction
  ): Promise<number> {
    const purchase = await purchaseRepository.findById(purchaseId);
    if (purchase.status === "canceled" || purchase.status === "closed")
      throw new Error(
        "Não é possível lançar pagamentos a compras fechadas ou canceladas"
      );
    if (transaction.date > new Date())
      throw new Error("Pagamentos não podem ter data futura");

    // Build Transaction with correct metadata
    transaction = {
      ...transaction,
      id: 0,
      title: `Compra #${purchaseId}`,
      origin: "purchase",
      type: "out",
      referenceId: purchaseId,
    };

    return await transactionRepository.create(transaction);
  }
  async list(filters: PurchaseFilters): Promise<PurchaseWithPayStatus[]> {
    // 1. Apply indexed filter (period)
    let purchases = await purchaseRepository.listByPeriod(
      new Date(filters.dateRange.start),
      new Date(filters.dateRange.end)
    );

    // 2. Filter by status
    if (filters.status !== undefined)
      purchases = purchases.filter((p) => p.status === filters.status);

    // 3. Filter by totalValue range
    if (filters.totalValue?.min !== undefined)
      purchases = purchases.filter(
        (p) => p.totalValue >= filters.totalValue!.min
      );
    if (filters.totalValue?.max !== undefined)
      purchases = purchases.filter(
        (p) => p.totalValue <= filters.totalValue!.max!
      );

    // 4. Filter by supplier text search (name, document, phone)
    if (filters.search?.trim()) {
      const suppliers = await supplierRepository.searchByText(filters.search);

      if (suppliers.length > 0) {
        const suppliersIds = suppliers.map((s) => s.id);
        purchases = purchases.filter(
          (p) =>
            p.supplierId !== undefined && suppliersIds.includes(p.supplierId)
        );
      }
    }

    // 5. Calculate derived data (paymentStatus = paid/partial/pending)
    let purchasesWithPayStatus = await this.attachPaymentStatus(purchases);

    // 6. Filter by paymentStatus (derived filter, applied in-memory)
    if (filters.paymentStatus !== undefined)
      purchasesWithPayStatus = purchasesWithPayStatus.filter(
        (p) => p.paymentStatus === filters.paymentStatus
      );

    return purchasesWithPayStatus;
  }

  async getById(id: number): Promise<PurchaseWithPayStatus> {
    const purchase = await purchaseRepository.findById(id);
    // Attach calculated paymentStatus
    const [purchaseWithPayStatus] = await this.attachPaymentStatus([purchase]);
    return purchaseWithPayStatus;
  }
  private async validateRules(purchase: Purchase): Promise<void> {
    // Validate supplier (must be active)
    if (purchase.supplierId !== undefined) {
      const supplier = await supplierRepository.findById(purchase.supplierId);
      if (!supplier.active)
        throw new Error(`Fornecedor ${supplier.name} está inativo`);
    }

    if (purchase.totalValue < 0)
      throw new Error("O valor total não pode ser negativo");

    // Validate items
    if (purchase.items.length > 0) {
      const referenceIds = purchase.items.map((i) => i.referenceId);
      const uniqueIds = new Set(referenceIds);

      // Check for duplicates
      if (referenceIds.length != uniqueIds.size)
        throw new Error(
          "Não é permitido adicionar o mesmo produto mais de uma vez"
        );

      // Validate each item
      for (const i of purchase.items) {
        if (i.type !== "product")
          throw new Error("Compras só podem conter produtos");

        if (i.quantity < 1)
          throw new Error("A quantidade deve ser pelo menos 1");

        if (i.unitValue < 0)
          throw new Error("O valor unitário não pode ser negativo");

        const product = await productRepository.findById(i.referenceId);
        if (!product)
          throw new Error(`Produto #${i.referenceId} não encontrado`);
        if (!product.active)
          throw new Error(`Produto ${product.name} está inativo`);
      }
    }
  }

  // Calculate paymentStatus based on Transactions (NEVER persisted)
  private async attachPaymentStatus(
    purchases: Purchase[]
  ): Promise<PurchaseWithPayStatus[]> {
    const purchasesWithPayStatus: PurchaseWithPayStatus[] = [];

    for (const p of purchases) {
      const transactions = (
        await transactionRepository.listByReferenceId(p.id)
      ).filter((t) => t.origin === "purchase" && t.type === "out");

      const totalPaid = transactions.reduce((total, t) => total + t.value, 0);
      purchasesWithPayStatus.push({
        ...p,
        paymentStatus:
          totalPaid >= p.totalValue
            ? "paid"
            : totalPaid > 0
            ? "partial"
            : "pending",
      });
    }

    return purchasesWithPayStatus;
  }

  // Calculate stock difference when items are updated
  private calculateStockDiff(
    oldItems: ComercialItem[],
    newItems: ComercialItem[]
  ): StockChanges[] {
    const changes: StockChanges[] = [];

    const oldMap = new Map(oldItems.map((i) => [i.referenceId, i.quantity]));
    const newMap = new Map(newItems.map((i) => [i.referenceId, i.quantity]));

    const allIds = new Set([...oldMap.keys(), ...newMap.keys()]);

    for (const productId of allIds) {
      const oldQty = oldMap.get(productId) || 0;
      const newQty = newMap.get(productId) || 0;
      const diff = newQty - oldQty;

      if (diff !== 0) changes.push({ productId, quantity: diff });
    }

    return changes;
  }

  // Apply stock changes ensuring stock never goes negative
  private async applyStockChanges(changes: StockChanges[]): Promise<void> {
    const confirmedChanges: { product: Product; quantity: number }[] = [];

    // Validate all changes first (ensure no negative stock)
    for (const c of changes) {
      const product = await productRepository.findById(c.productId);
      if (!product.stockControl || product.stock === undefined) continue;
      const newStock = product.stock + c.quantity;
      if (newStock < 0)
        throw new Error(`Produto ${product.name} tem estoque insuficiente`);

      confirmedChanges.push({ product, quantity: c.quantity });
    }

    // Apply confirmed changes
    for (const c of confirmedChanges) {
      const newStock = c.product.stock! + c.quantity;
      await productRepository.update(c.product.id, {
        ...c.product,
        stock: newStock,
      });
    }
  }
}

export const purchaseService = new PurchaseService();
