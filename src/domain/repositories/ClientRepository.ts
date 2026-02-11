import { db } from "../../infra/database";
import type { CreateClientDTO, UpdateClientDTO } from "../dtos/PersonDTO";
import type { Client } from "../entities/person";

class ClientRepository {
  async create(data: CreateClientDTO): Promise<number> {
    const clientData = {
      ...data,
      active: true,
      createdAt: new Date(),
    };
    return await db.clients.add(clientData as Client);
  }

  async update(id: number, data: UpdateClientDTO): Promise<number> {
    const updated = await db.clients.update(id, data);
    if (updated === 0) throw new Error("Nenhum cliente foi atualizado");

    return updated;
  }

  // Toggle active/inactive status (soft-delete)
  async active(id: number, active: boolean): Promise<number> {
    const updated = await db.clients.update(id, { active });
    if (updated === 0) throw new Error("Nenhum cliente foi atualizado");

    return updated;
  }

  async findById(id: number): Promise<Client> {
    const client = await db.clients.get(id);
    if (!client) throw new Error("Cliente não encontrado");

    return client;
  }

  // Search by name, document, or phone (uses indexed fields)
  async searchByText(text: string): Promise<Client[]> {
    if (!text.trim()) throw new Error("O texto de busca não pode ser vazio");

    const [byName, byDocument, byPhone] = await Promise.all([
      db.clients.where("name").startsWithIgnoreCase(text).toArray(),
      db.clients.where("document").startsWithIgnoreCase(text).toArray(),
      db.clients.where("phone").startsWithIgnoreCase(text).toArray(),
    ]);

    // Remove duplicates by id
    return Array.from(
      new Map(
        [...byName, ...byDocument, ...byPhone].map((c) => [c.id, c])
      ).values()
    );
  }

  async listByActive(active: boolean): Promise<Client[]> {
    return await db.clients.where("active").equals(Number(active)).toArray();
  }

  async listAll(): Promise<Client[]> {
    return await db.clients.toArray();
  }
}

export const clientRepository = new ClientRepository();
