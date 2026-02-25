import { db } from "@/infra/database";
import type { CreateServiceDTO, UpdateServiceDTO } from "../dtos/ServiceDTO";
import type { Service } from "../entities/service";

class ServiceRepository {
  async create(data: CreateServiceDTO): Promise<number> {
    const serviceData = {
      ...data,
      active: true,
    };
    return await db.services.add(serviceData as Service);
  }

  async update(id: number, data: UpdateServiceDTO): Promise<number> {
    const updated = await db.services.update(id, data);
    if (updated === 0) throw new Error("Nenhum serviço foi atualizado");

    return updated;
  }

  // Toggle active/inactive status (soft-delete)
  async active(id: number, active: boolean): Promise<number> {
    const updated = await db.services.update(id, { active });
    if (updated === 0) throw new Error("Nenhum serviço foi atualizado");

    return updated;
  }

  async findById(id: number): Promise<Service> {
    const service = await db.services.get(id);
    if (!service) throw new Error("Serviço não encontrado");

    return service;
  }

  // Search by name (uses indexed field)
  async searchByText(text: string): Promise<Service[]> {
    if (!text.trim()) throw new Error("O texto de busca não pode ser vazio");

    return await db.services.where("name").startsWithIgnoreCase(text).toArray();
  }

  async listByActive(active: boolean): Promise<Service[]> {
    return await db.services.where("active").equals(Number(active)).toArray();
  }

  async listAll(): Promise<Service[]> {
    return await db.services.toArray();
  }
}

export const serviceRepository = new ServiceRepository();
