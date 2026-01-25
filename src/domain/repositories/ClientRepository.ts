import { db } from "../../infra/database";
import type { Client } from "../entities/person";

export class ClientRepository {
  // Create
  async create(client: Client) {
    return await db.clients.add(client);
  }

  // Update
  async update(updatedClient: Client) {
    return await db.clients.put(updatedClient);
  }

  // Read
  async findById(id: number) {
    return await db.clients.get(id);
  }

  async searchByText(text: string) {
    const [byName, byDocument, byPhone] = await Promise.all([
      db.clients.where("name").startsWithIgnoreCase(text).toArray(),
      db.clients.where("document").startsWithIgnoreCase(text).toArray(),
      db.clients.where("phone").startsWithIgnoreCase(text).toArray(),
    ]);

    return Array.from(
      new Map(
        [...byName, ...byDocument, ...byPhone].map((c) => [c.id, c])
      ).values()
    );
  }

  async listByActive(active: boolean) {
    return await db.clients.where("active").equals(Number(active)).toArray();
  }

  async listAll() {
    return await db.clients.toArray();
  }
}
