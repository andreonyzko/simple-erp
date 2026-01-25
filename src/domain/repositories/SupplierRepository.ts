import { db } from "../../infra/database";
import type { Supplier } from "../entities/person";

export class SupplierRepository {
  // Create
  async create(supplier: Supplier) {
    return await db.suppliers.add(supplier);
  }

  // Update
  async update(updatedSupplier: Supplier) {
    return await db.suppliers.put(updatedSupplier);
  }

  // Read
  async findById(id: number) {
    return await db.suppliers.get(id);
  }

  async searchByText(text: string) {
    const [byName, byDocument, byPhone] = await Promise.all([
      db.suppliers.where("name").startsWithIgnoreCase(text).toArray(),
      db.suppliers.where("document").startsWithIgnoreCase(text).toArray(),
      db.suppliers.where("phone").startsWithIgnoreCase(text).toArray(),
    ]);

    return Array.from(
      new Map(
        [...byName, ...byDocument, ...byPhone].map((s) => [s.id, s])
      ).values()
    );
  }

  async listByActive(active: boolean) {
    return await db.suppliers.where("active").equals(Number(active)).toArray();
  }

  async listAll() {
    return await db.suppliers.toArray();
  }
}
