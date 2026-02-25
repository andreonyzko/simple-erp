import { db } from "@/infra/database";
import type { CreateSaleDTO, UpdateSaleDTO } from "../dtos/SaleDTO";
import type { Sale } from "../entities/sale";
import type { SalePurchaseStatus } from "../types/SalePurchaseStatus";

class SaleRepository {
  async create(data: CreateSaleDTO): Promise<number> {
    const saleData = {
      ...data,
      status: "open" as SalePurchaseStatus,
    };
    return await db.sales.add(saleData as Sale);
  }

  async update(id: number, data: UpdateSaleDTO): Promise<number> {
    const updated = await db.sales.update(id, data);
    if (updated === 0) throw new Error("Nenhuma venda foi atualizada");

    return updated;
  }

  // Update only status (used for state transitions: open → closed → canceled)
  async updateStatus(id: number, status: SalePurchaseStatus): Promise<number> {
    const updated = await db.sales.update(id, { status });
    if (updated === 0) throw new Error("Nenhuma venda foi atualizada");

    return updated;
  }

  async findById(id: number): Promise<Sale> {
    const sale = await db.sales.get(id);
    if (!sale) throw new Error("Venda não encontrada");

    return sale;
  }

  async listByClientId(clientId: number): Promise<Sale[]> {
    return await db.sales.where("clientId").equals(clientId).toArray();
  }

  async listByClientIds(clientsId: number[]): Promise<Sale[]> {
    return await db.sales.where("clientId").anyOf(clientsId).toArray();
  }

  async listByStatus(status: SalePurchaseStatus): Promise<Sale[]> {
    return await db.sales.where("status").equals(status).toArray();
  }

  async listByPeriod(start: Date, end: Date): Promise<Sale[]> {
    if (start > end)
      throw new Error("Data inicial não pode ser maior que a final");
    
    return await db.sales
      .where("date")
      .between(start, end, true, true)
      .toArray();
  }

  async listAll(): Promise<Sale[]> {
    return await db.sales.toArray();
  }
}

export const saleRepository = new SaleRepository();
