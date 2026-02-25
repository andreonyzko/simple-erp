import type { CreateSaleDTO, UpdateSaleDTO } from "../dtos/SaleDTO";
import type { CreateTransactionDTO } from "../dtos/TransactionDTO";
import type { Product } from "../entities/product";
import type { Sale } from "../entities/sale";
import type { Transaction } from "../entities/transaction";
import { clientRepository } from "../repositories/ClientRepository";
import { productRepository } from "../repositories/ProductRepository";
import { saleRepository } from "../repositories/SaleRepository";
import { serviceRepository } from "../repositories/ServiceRepository";
import { transactionRepository } from "../repositories/TransactionRepository";
import type { ComercialItem } from "../types/ComercialItem";
import type { PaymentStatus } from "../types/Payment";
import type { SalePurchaseStatus } from "../types/SalePurchaseStatus";

type SaleFilters = {
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

type StockChanges = {
  productId: number;
  quantity: number;
};

export type SaleWithPayStatus = Sale & { paymentStatus: string };

class SaleService {
  async create(
    data: CreateSaleDTO,
    initialTransactions: Transaction[]
  ): Promise<number> {
    // Build full entity to validate before persist
    const sale: Sale = {
      ...data,
      id: 0,
      status: "open",
    };
    await this.validateRules(sale);

    // Apply stock changes if needed (decrease product quantities)
    if (data.affectStock) {
      const productItems = data.items.filter((i) => i.type === "product");
      const stockChanges: StockChanges[] = productItems.map((i) => ({
        productId: i.referenceId,
        quantity: -i.quantity,
      }));
      await this.applyStockChanges(stockChanges);
    }

    const saleId = await saleRepository.create(data);

    // Register initial payments (if any)
    for (const t of initialTransactions) await this.addPayment(saleId, t);

    return saleId;
  }

  async update(id: number, data: UpdateSaleDTO): Promise<number> {
    const current = await saleRepository.findById(id);

    // Merge preserving immutable fields (id, status, affectStock)
    const updated: Sale = {
      ...current,
      ...data,
      id: current.id,
      status: current.status,
      affectStock: current.affectStock,
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
          await this.applyStockChanges(stockChanges);
        }
        break;
      case "closed":
        // Only notes can be edited
        if (Object.keys(data).some((key) => key !== "notes"))
          throw new Error("Vendas fechadas só podem ter notas editadas");
        break;

      case "canceled":
        throw new Error("Vendas canceladas não podem ser editadas");
    }

    return await saleRepository.update(id, data);
  }
  async close(id: number): Promise<number> {
    const sale = await saleRepository.findById(id);
    if (sale.status === "closed") throw new Error("Essa venda já está fechada");
    if (sale.status === "canceled")
      throw new Error("Não é possível fechar vendas canceladas");
    return await saleRepository.updateStatus(id, "closed");
  }
  async cancel(id: number): Promise<number> {
    const sale = await saleRepository.findById(id);
    if (sale.status === "canceled")
      throw new Error("Essa venda já foi cancelada");

    // 1. Create corrective Transaction (refund)
    const transactions = (
      await transactionRepository.listByReferenceId(id)
    ).filter((t) => t.origin === "sale" && t.type === "in");
    const totalTransactions = transactions.reduce(
      (total, t) => total + t.value,
      0
    );

    const corrective: CreateTransactionDTO = {
      title: `Estorno da venda #${id}`,
      description: `Motivo: cancelamento da venda`,
      origin: "sale",
      type: "out",
      date: new Date(),
      referenceId: id,
      value: totalTransactions,
      method: transactions[0].method,
    };

    await transactionRepository.create(corrective);

    // 2. Revert stock changes (restore product quantities)
    if (sale.affectStock) {
      const productItems = sale.items.filter((i) => i.type === "product");
      const stockChanges: StockChanges[] = productItems.map((i) => ({
        productId: i.referenceId,
        quantity: i.quantity,
      }));
      await this.applyStockChanges(stockChanges);
    }

    return await saleRepository.updateStatus(id, "canceled");
  }
  async addPayment(saleId: number, transaction: Transaction): Promise<number> {
    const sale = await saleRepository.findById(saleId);
    if (sale.status === "closed" || sale.status === "canceled")
      throw new Error(
        "Não é possível adicionar pagamentos a vendas fechadas ou canceladas"
      );
    if (transaction.date > new Date())
      throw new Error("Pagamentos não podem ter data futura");

    // Build Transaction with correct metadata
    transaction = {
      ...transaction,
      id: 0,
      title: `Venda #${saleId}`,
      origin: "sale",
      type: "in",
      referenceId: saleId,
    };

    return await transactionRepository.create(transaction);
  }
  async list(filters: SaleFilters): Promise<SaleWithPayStatus[]> {
    // 1. Apply indexed filter (period)
    let sales = await saleRepository.listByPeriod(
      new Date(filters.dateRange.start),
      new Date(filters.dateRange.end)
    );

    // 2. Filter by status
    if (filters.status !== undefined)
      sales = sales.filter((s) => s.status === filters.status);

    // 3. Filter by totalValue range
    if (filters.totalValue?.min !== undefined)
      sales = sales.filter((s) => s.totalValue >= filters.totalValue!.min);
    if (filters.totalValue?.max !== undefined)
      sales = sales.filter((s) => s.totalValue <= filters.totalValue!.max!);

    // 4. Filter by client text search (name, document, phone)
    if (filters.search?.trim()) {
      const clients = await clientRepository.searchByText(filters.search);

      if (clients.length > 0) {
        const clientsIds = clients.map((c) => c.id);
        sales = sales.filter((s) => clientsIds.includes(s.clientId!));
      }
    }

    // 5. Calculate derived data (paymentStatus = paid/partial/pending)
    let salesWithPayStatus = await this.attachPaymentStatus(sales);

    // 6. Filter by paymentStatus (derived filter, applied in-memory)
    if (filters.paymentStatus !== undefined)
      salesWithPayStatus = salesWithPayStatus.filter(
        (s) => s.paymentStatus === filters.paymentStatus
      );

    return salesWithPayStatus;
  }

  async getById(id: number): Promise<SaleWithPayStatus> {
    const sale = await saleRepository.findById(id);
    // Attach calculated paymentStatus
    const [saleWithPayStatus] = await this.attachPaymentStatus([sale]);
    return saleWithPayStatus;
  }
  private async validateRules(sale: Sale) {
    // Validate client (must be active)
    if (sale.clientId) {
      const client = await clientRepository.findById(sale.clientId);
      if (!client.active)
        throw new Error(`O cliente ${client.name} está inativo`);
    }

    if (sale.totalValue < 0)
      throw new Error("O valor total não pode ser negativo");

    // Validate items
    if (sale.items.length > 0) {
      const productsReferenceIds = sale.items
        .filter((i) => i.type === "product")
        .map((i) => i.referenceId);
      const servicesReferenceIds = sale.items
        .filter((i) => i.type === "service")
        .map((i) => i.referenceId);
      const uniqueProductIds = new Set(productsReferenceIds);
      const uniqueServiceIds = new Set(servicesReferenceIds);

      // Check for duplicates
      if (
        productsReferenceIds.length != uniqueProductIds.size ||
        servicesReferenceIds.length != uniqueServiceIds.size
      )
        throw new Error(
          "Não é permitido adicionar o mesmo item mais de uma vez"
        );

      // Validate each item
      for (const i of sale.items) {
        if (i.quantity < 1)
          throw new Error("A quantidade deve ser pelo menos 1");

        if (i.unitValue < 0)
          throw new Error("O valor unitário não pode ser negativo");

        if (i.type == "product") {
          const product = await productRepository.findById(i.referenceId);
          if (!product)
            throw new Error(`Produto #${i.referenceId} não encontrado`);
          if (!product.active)
            throw new Error(`Produto ${product.name} está inativo`);
        } else {
          const service = await serviceRepository.findById(i.referenceId);
          if (!service)
            throw new Error(`Serviço #${i.referenceId} não encontrado`);
          if (!service.active)
            throw new Error(`Serviço ${service.name} está inativo`);
        }
      }
    }
  }

  // Calculate paymentStatus based on Transactions (NEVER persisted)
  private async attachPaymentStatus(
    sales: Sale[]
  ): Promise<SaleWithPayStatus[]> {
    const salesWithPayStatus: SaleWithPayStatus[] = [];
    for (const s of sales) {
      const transactions = (
        await transactionRepository.listByReferenceId(s.id)
      ).filter((t) => t.origin === "sale" && t.type === "in");
      const totalPaid = transactions.reduce((total, t) => total + t.value, 0);
      salesWithPayStatus.push({
        ...s,
        paymentStatus:
          totalPaid >= s.totalValue
            ? "paid"
            : totalPaid > 0
            ? "partial"
            : "pending",
      });
    }
    return salesWithPayStatus;
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

      // Positive diff = restore stock, Negative diff = reduce stock
      const diff = newQty - oldQty;
      if (diff !== 0) changes.push({ productId, quantity: -diff });
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
export const saleService = new SaleService();
