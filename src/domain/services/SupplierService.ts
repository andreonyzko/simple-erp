import type { CreateSupplierDTO, UpdateSupplierDTO } from "../dtos/PersonDTO";
import type { Supplier } from "../entities/person";
import type { Purchase } from "../entities/purchase";
import { purchaseRepository } from "../repositories/PurchaseRepository";
import { supplierRepository } from "../repositories/SupplierRepository";
import { transactionRepository } from "../repositories/TransactionRepository";

type SupplierFilters = {
  text?: string;
  active?: boolean;
  debts?: {
    min: number;
    max?: number;
  };
};

export type SupplierWithDebt = Supplier & { debt: number };

class SupplierService {
  async create(data: CreateSupplierDTO): Promise<number> {
    // Build full entity to apply business rules before persist
    const supplier: Supplier = {
      ...data,
      id: 0,
      active: true,
      createdAt: new Date(),
    };
    this.validateRules(supplier);

    return await supplierRepository.create(data);
  }
  async update(id: number, data: UpdateSupplierDTO): Promise<number> {
    const current = await supplierRepository.findById(id);

    // Merge preserving immutable fields (id, active, createdAt)
    const updated: Supplier = {
      ...current,
      ...data,
      id: current.id,
      active: current.active,
      createdAt: current.createdAt,
    };

    this.validateRules(updated);

    return await supplierRepository.update(id, data);
  }
  async active(id: number, active: boolean): Promise<number> {
    const supplier = await supplierRepository.findById(id);

    // Validate state transition (avoid redundant toggles)
    if (supplier.active === active)
      throw new Error(
        `Esse fornecedor já está ${active ? "ativo" : "inativo"}`
      );

    return await supplierRepository.active(id, active);
  }

  async list(filters: SupplierFilters): Promise<SupplierWithDebt[]> {
    // 1. Apply indexed filters (text search or active status)
    let suppliers = filters.text?.trim()
      ? await supplierRepository.searchByText(filters.text!)
      : filters.active !== undefined
      ? await supplierRepository.listByActive(filters.active)
      : await supplierRepository.listAll();

    // 2. Filter by active (if text search was applied)
    if (filters.active !== undefined)
      suppliers = suppliers.filter((s) => s.active === filters.active);

    // 3. Calculate derived data (debt = totalValue - totalPaid)
    let suppliersWithDebt: SupplierWithDebt[] = await this.attachDebts(
      suppliers
    );

    // 4. Filter by debt range (derived filter, applied in-memory)
    if (filters.debts?.min !== undefined)
      suppliersWithDebt = suppliersWithDebt.filter(
        (s) => s.debt >= filters.debts!.min
      );
    if (filters.debts?.max !== undefined)
      suppliersWithDebt = suppliersWithDebt.filter(
        (s) => s.debt <= filters.debts!.max!
      );

    return suppliersWithDebt;
  }
  async getById(id: number): Promise<SupplierWithDebt> {
    const supplier = await supplierRepository.findById(id);
    const [supplierWithDebt] = await this.attachDebts([supplier]);
    return supplierWithDebt;
  }

  // Calculate debt based on Purchases and Transactions (NEVER persisted)
  private async attachDebts(
    suppliers: Supplier[]
  ): Promise<SupplierWithDebt[]> {
    if (suppliers.length <= 0) return [];

    const suppliersIds = suppliers.map((s) => s.id);

    // 1. Get all purchases from these suppliers (excluding canceled)
    const purchases = (
      await purchaseRepository.listBySuppliersIds(suppliersIds)
    ).filter((p) => p.status !== "canceled");
    const purchasesIds = purchases.map((p) => p.id);

    // 2. Get all expenses transactions from these purchases
    const transactions = (
      await transactionRepository.listByReferenceIds(purchasesIds)
    ).filter((t) => t.origin === "purchase" && t.type === "out");

    // 3. Index purchases by supplier
    const purchasesBySupplier = new Map<number, Purchase[]>();
    for (const p of purchases) {
      const supplierId = p.supplierId!;
      if (!purchasesBySupplier.has(supplierId))
        purchasesBySupplier.set(supplierId, []);
      purchasesBySupplier.get(supplierId)!.push(p);
    }

    // 4. Calculate total paid per purchase
    const paidByPurchase = new Map<number, number>();
    for (const t of transactions) {
      paidByPurchase.set(
        t.referenceId!,
        (paidByPurchase.get(t.referenceId!) || 0) + t.value
      );
    }

    // 5. Calculate debt for each supplier (totalValue - totalPaid)
    return suppliers.map((s) => {
      const supplierPurchases = purchasesBySupplier.get(s.id) || [];

      const totalPurchases = supplierPurchases.reduce(
        (total, p) => total + p.totalValue,
        0
      );
      const totalPaid = supplierPurchases.reduce(
        (total, p) => total + (paidByPurchase.get(p.id) || 0),
        0
      );

      return { ...s, debt: Math.max(totalPurchases - totalPaid, 0) };
    });
  }
  private validateRules(supplier: Supplier): void {
    if (!supplier.name.trim())
      throw new Error("O nome do fornecedor não pode ser vazio");
  }
}

export const supplierService = new SupplierService();
