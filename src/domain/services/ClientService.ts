import type { CreateClientDTO, UpdateClientDTO } from "../dtos/PersonDTO";
import type { Client } from "../entities/person";
import type { Sale } from "../entities/sale";
import { clientRepository } from "../repositories/ClientRepository";
import { saleRepository } from "../repositories/SaleRepository";
import { transactionRepository } from "../repositories/TransactionRepository";

type ClientFilters = {
  search?: string;
  active?: boolean;
  debts?: {
    min: number;
    max?: number;
  };
};

type ClientWithDebt = Client & {
  debt: number;
};

class ClientService {
  async create(data: CreateClientDTO): Promise<number> {
    // Build full entity to apply business rules before persist
    const client: Client = {
      ...data,
      id: 0,
      active: true,
      createdAt: new Date(),
    };
    this.validateRules(client);

    return await clientRepository.create(data);
  }
  async update(id: number, data: UpdateClientDTO): Promise<number> {
    const current = await clientRepository.findById(id);

    // Merge preserving immutable fields (id, active, createdAt)
    const updated: Client = {
      ...current,
      ...data,
      id: current.id,
      active: current.active,
      createdAt: current.createdAt,
    };

    this.validateRules(updated);

    return await clientRepository.update(id, data);
  }
  async active(id: number, active: boolean): Promise<number> {
    const client = await clientRepository.findById(id);

    // Validate state transition (avoid redundant toggles)
    if (client.active === active)
      throw new Error(`Esse cliente já está ${active ? "ativo" : "inativo"}`);

    return await clientRepository.active(id, active);
  }

  async list(filters: ClientFilters): Promise<ClientWithDebt[]> {
    // 1. Apply indexed filters (text search or active status)
    let clients = filters.search?.trim()
      ? await clientRepository.searchByText(filters.search)
      : filters.active !== undefined
      ? await clientRepository.listByActive(filters.active)
      : await clientRepository.listAll();

    // 2. Filter by active (if search was applied)
    if (filters.active !== undefined)
      clients = clients.filter((c) => c.active === filters.active);

    // 3. Calculate derived data (debt = totalValue - totalPaid)
    let clientsWithDebts = await this.attachDebts(clients);

    // 4. Filter by debt range (derived filter, applied in-memory)
    if (filters.debts) {
      const { min, max } = filters.debts;
      clientsWithDebts = clientsWithDebts.filter((c) => {
        if (min !== undefined && c.debt < min) return false;
        if (max !== undefined && c.debt > max) return false;
        return true;
      });
    }

    return clientsWithDebts;
  }

  async getById(clientId: number): Promise<ClientWithDebt> {
    const client = await clientRepository.findById(clientId);

    // Attach calculated debt
    const [clientWithDebt] = await this.attachDebts([client]);

    return clientWithDebt;
  }

  private async attachDebts(clients: Client[]): Promise<ClientWithDebt[]> {
    if (clients.length <= 0) return [];

    const clientsId = clients.map((c) => c.id);

    // 1. Get all sales from these clients (excluding canceled)
    const sales = (await saleRepository.listByClientIds(clientsId)).filter(
      (s) => s.status !== "canceled"
    );
    const salesIds = sales.map((s) => s.id);

    // 2. Get all incoming transactions from these sales
    const transactions = (
      await transactionRepository.listByReferenceIds(salesIds)
    ).filter((t) => t.origin === "sale" && t.type === "in");

    // 3. Index sales by client
    const salesByClient = new Map<number, Sale[]>();
    for (const s of sales) {
      const clientId = s.clientId!;
      if (!salesByClient.has(clientId)) salesByClient.set(clientId, []);
      salesByClient.get(clientId)!.push(s);
    }

    // 4. Calculate total paid per sale
    const paidBySale = new Map<number, number>();
    for (const t of transactions) {
      paidBySale.set(
        t.referenceId!,
        (paidBySale.get(t.referenceId!) || 0) + t.value
      );
    }

    // 5. Calculate debt for each client (totalValue - totalPaid)
    return clients.map((c) => {
      const clientSales = salesByClient.get(c.id) || [];

      const totalSales = clientSales.reduce(
        (total, sale) => total + sale.totalValue,
        0
      );

      const totalPaid = clientSales.reduce(
        (total, sale) => total + (paidBySale.get(sale.id) || 0),
        0
      );

      return { ...c, debt: Math.max(totalSales - totalPaid, 0) };
    });
  }

  private validateRules(client: Client): void {
    if (!client.name.trim())
      throw new Error("O nome do cliente não pode ser vazio");
  }
}

export const clientService = new ClientService();
