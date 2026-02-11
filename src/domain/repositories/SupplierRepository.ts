import { db } from "../../infra/database";
import type { CreateSupplierDTO, UpdateSupplierDTO } from "../dtos/PersonDTO";
import type { Supplier } from "../entities/person";

class SupplierRepository {
  async create(data: CreateSupplierDTO): Promise<number> {
    const supplierData = {
      ...data,
      active: true,
      createdAt: new Date(),
    };
    return await db.suppliers.add(supplierData as Supplier);
  }

  async update(id: number, data: UpdateSupplierDTO): Promise<number> {
    const updated = await db.suppliers.update(id, data);
    if (updated === 0) throw new Error("Nenhum fornecedor foi atualizado");

    return updated;
  }

  // Toggle active/inactive status (soft-delete)
  async active(id: number, active: boolean): Promise<number> {
    const updated = await db.suppliers.update(id, { active });
    if (updated === 0) throw new Error("Nenhum fornecedor foi atualizado");

    return updated;
  }

  async findById(id: number): Promise<Supplier> {
    const supplier = await db.suppliers.get(id);
    if (!supplier) throw new Error("Fornecedor não encontrado");

    return supplier;
  }

  // Search by name, document, or phone (uses indexed fields)
  async searchByText(text: string): Promise<Supplier[]> {
    if (!text.trim()) throw new Error("O texto de busca não pode ser vazio");

    const [byName, byDocument, byPhone] = await Promise.all([
      db.suppliers.where("name").startsWithIgnoreCase(text).toArray(),
      db.suppliers.where("document").startsWithIgnoreCase(text).toArray(),
      db.suppliers.where("phone").startsWithIgnoreCase(text).toArray(),
    ]);

    // Remove duplicates by id
    return Array.from(
      new Map(
        [...byName, ...byDocument, ...byPhone].map((s) => [s.id, s])
      ).values()
    );
  }

  async listByActive(active: boolean): Promise<Supplier[]> {
    return await db.suppliers.where("active").equals(Number(active)).toArray();
  }

  async listAll(): Promise<Supplier[]> {
    return await db.suppliers.toArray();
  }
}

export const supplierRepository = new SupplierRepository();
