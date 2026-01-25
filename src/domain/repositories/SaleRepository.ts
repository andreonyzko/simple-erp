import { db } from "../../infra/database";
import type { Sale } from "../entities/sale";
import type { PaymentStatus } from "../types/PaymentStatus";
import type { SalePurchaseStatus } from "../types/SalePurchaseStatus";

export class SaleRepository{
    // Create
    async create(sale: Sale){
        return await db.sales.add(sale);
    }

    // Update
    async update(updatedSale: Sale){
        return await db.sales.put(updatedSale);
    }

    // Read
    async findById(id: number){
        return await db.sales.get(id);
    }

    async listByClientId(clientId: number){
        return await db.sales.where('clientId').equals(clientId).toArray();
    }

    async listByStatus(status: SalePurchaseStatus){
        return await db.sales.where('status').equals(status).toArray();
    }

    async listByPaymentStatus(paymentStatus: PaymentStatus){
        return await db.sales.where('paymentStatus').equals(paymentStatus).toArray();
    }

    async listByPeriod(start: Date, end: Date){
        return await db.sales.where('date').between(start, end, true, true).toArray();
    }

    async listAll(){
        return await db.sales.toArray();
    }
}