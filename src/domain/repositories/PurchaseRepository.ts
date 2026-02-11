import { db } from "../../infra/database";
import type { CreatePurchaseDTO, UpdatePurchaseDTO } from "../dtos/PurchaseDTO";
import type { Purchase } from "../entities/purchase";
import type { SalePurchaseStatus } from "../types/SalePurchaseStatus";

class PurchaseRepository {
  async create(data: CreatePurchaseDTO): Promise<number> {
    const purchaseData = {
      ...data,
      status: "open" as SalePurchaseStatus,
    };
    return await db.purchases.add(purchaseData as Purchase);
  }

  async update(id: number, data: UpdatePurchaseDTO): Promise<number> {
    const updated = await db.purchases.update(id, data);
    if (updated === 0) throw new Error("Nenhuma compra foi atualizada");

    return updated;
  }

  // Update only status (used for state transitions: open → closed → canceled)
  async updateStatus(id: number, status: SalePurchaseStatus): Promise<number> {
    const updated = await db.purchases.update(id, { status });
    if (updated === 0) throw new Error("Nenhuma compra foi atualizada");

    return updated;
  }

  async findById(id: number): Promise<Purchase> {
    const purchase = await db.purchases.get(id);
    if (!purchase) throw new Error("Compra não encontrada");

    return purchase;
  }

  async listBySupplierId(supplierId: number): Promise<Purchase[]> {
    return await db.purchases.where("supplierId").equals(supplierId).toArray();
  }

  async listBySuppliersIds(suppliersIds: number[]): Promise<Purchase[]> {
    return await db.purchases.where("supplierId").anyOf(suppliersIds).toArray();
  }

  async listByStatus(status: SalePurchaseStatus): Promise<Purchase[]> {
    return await db.purchases.where("status").equals(status).toArray();
  }

  async listByPeriod(start: Date, end: Date): Promise<Purchase[]> {
    if (start > end)
      throw new Error("Data inicial não pode ser maior que a final");
    
    return await db.purchases
      .where("date")
      .between(start, end, true, true)
      .toArray();
  }

  async listAll(): Promise<Purchase[]> {
    return await db.purchases.toArray();
  }
}

export const purchaseRepository = new PurchaseRepository();
