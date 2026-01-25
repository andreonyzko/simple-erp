import Dexie, { type Table } from "dexie";
import type { CalendarEvent } from "../domain/entities/calendar";
import type { Client, Supplier } from "../domain/entities/person";
import type { Product } from "../domain/entities/product";
import type { Purchase } from "../domain/entities/purchase";
import type { Sale } from "../domain/entities/sale";
import type { Service } from "../domain/entities/service";
import type { Transaction } from "../domain/entities/transaction";

export class ERPDataBase extends Dexie {
    calendar!: Table<CalendarEvent, number>;
    clients!: Table<Client, number>;
    suppliers!: Table<Supplier, number>;
    products!: Table<Product, number>;
    services!: Table<Service, number>;
    purchases!: Table<Purchase, number>;
    sales!: Table<Sale, number>;
    transactions!: Table<Transaction, number>;

    constructor(){
        super('erp-database');

        this.version(1).stores({
            calendar: "++id, title, date",
            clients: "++id, name, document, phone, active",
            suppliers: "++id, name, document, phone, active",
            products: "++id, name, supplierId, stockControl, stock, cost, sellPrice, active",
            services: "++id, name, price, active",
            purchases: "++id, supplierId, date, totalValue, paymentStatus, status",
            sales: "++id, clientId, date, totalValue, paymentStatus, status",
            transactions: "++id, type, origin, date, referenceId, method, value"
        })
    }
}

export const db = new ERPDataBase();