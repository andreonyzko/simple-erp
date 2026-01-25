import { db } from "../../infra/database";
import type { Product } from "../entities/product";

export class ProductRepository {
    // Create
    async create(product: Product){
        return await db.products.add(product);
    }

    // Update
    async update(updatedProduct: Product){
        return await db.products.put(updatedProduct);
    }

    // Read
    async findById(id: number){
        return await db.products.get(id);
    }

    async searchByName(text: string){
        return await db.products.where('name').startsWithIgnoreCase(text).toArray();
    }

    async listByActive(active: boolean){
        return await db.products.where('active').equals(Number(active)).toArray();
    }

    async listBySupplierId(supplierId: number){
        return await db.products.where('supplierId').equals(supplierId).toArray();
    }

    async listWithStock(){
        return await db.products.where('stock').above(0).toArray();
    }

    async listWithoutStock(){
        return await db.products.where('stock').equals(0).toArray();
    }

    async listWithoutStockControl(){
        return await db.products.where('stockControl').equals(0).toArray();
    }

    async listAll(){
        return await db.products.toArray();
    }
}