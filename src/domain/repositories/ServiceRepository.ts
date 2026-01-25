import { db } from "../../infra/database";
import type { Service } from "../entities/service";

export class ServiceRepository {
    // Create
    async create(service: Service){
        return await db.services.add(service);
    }

    // Update
    async update(updatedService: Service){
        return await db.services.put(updatedService);
    }

    // Read
    async findById(id: number) {
        return await db.services.get(id);
    }

    async searchByName(text: string){
        return await db.services.where('name').startsWithIgnoreCase(text).toArray();
    }

    async listByActive(active: boolean){
        return await db.services.where('active').equals(Number(active)).toArray();
    }

    async listAll(){
        return await db.services.toArray();
    }
}