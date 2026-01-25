import { db } from "../../infra/database";
import type { Purchase } from "../entities/purchase";
import type { PaymentStatus } from "../types/PaymentStatus";
import type { SalePurchaseStatus } from "../types/SalePurchaseStatus";

export class PurchaseRepository {
  // Create
  async create(purchase: Purchase){
    return await db.purchases.add(purchase);
  }

  // Update
  async update(updatedPurchase: Purchase){
    return await db.purchases.put(updatedPurchase);
  }

  // Read
  async findById(id: number){
    return await db.purchases.get(id);
  }

  async listBySupplierId(supplierId: number){
    return await db.purchases.where('supplierId').equals(supplierId).toArray();
  }

  async listByStatus(status: SalePurchaseStatus){
    return await db.purchases.where('status').equals(status).toArray();
  }

  async listByPaymentStatus(paymentStatus: PaymentStatus){
    return await db.purchases.where('paymentStatus').equals(paymentStatus).toArray();
  }

  async listByPeriod(start: Date, end: Date){
    return await db.purchases.where('date').between(start, end, true, true).toArray();
  }

  async listAll(){
    return db.purchases.toArray();
  }
}