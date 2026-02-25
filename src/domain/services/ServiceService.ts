import type { CreateServiceDTO, UpdateServiceDTO } from "../dtos/ServiceDTO";
import type { Service } from "../entities/service";
import { serviceRepository } from "../repositories/ServiceRepository";

type ServiceFilters = {
  search?: string;
  price?: {
    min: number;
    max?: number;
  };
  active?: boolean;
};

class ServiceService {
  async create(data: CreateServiceDTO): Promise<number> {
    // Build full entity to apply business rules before persist
    const service: Service = {
      ...data,
      id: 0,
      active: true,
    };
    this.validateRules(service);

    return serviceRepository.create(data);
  }

  async update(id: number, data: UpdateServiceDTO): Promise<number> {
    const current = await serviceRepository.findById(id);

    // Merge preserving immutable fields (id, active)
    const updated: Service = {
      ...current,
      ...data,
      id: current.id,
      active: current.active,
    };
    this.validateRules(updated);

    return await serviceRepository.update(id, data);
  }
  async active(id: number, active: boolean): Promise<number> {
    const service = await serviceRepository.findById(id);

    // Validate state transition (avoid redundant toggles)
    if (active === service.active)
      throw new Error(`Este serviço já está ${active ? "ativo" : "inativo"}`);

    return await serviceRepository.active(id, active);
  }

  async list(filters: ServiceFilters): Promise<Service[]> {
    // 1. Apply indexed filters (text or active)
    let services = filters.search?.trim()
      ? await serviceRepository.searchByText(filters.search)
      : filters.active !== undefined
      ? await serviceRepository.listByActive(filters.active)
      : await serviceRepository.listAll();

    // 2. Filter by active (if search was applied)
    if (filters.active !== undefined)
      services = services.filter((s) => s.active === filters.active);

    // 3. Filter by price range
    if (filters.price?.min !== undefined)
      services = services.filter(
        (s) => s.price && s.price >= filters.price!.min
      );
    if (filters.price?.max !== undefined)
      services = services.filter(
        (s) => s.price && s.price <= filters.price!.max!
      );

    return services;
  }

  async getById(id: number): Promise<Service> {
    return await serviceRepository.findById(id);
  }
  private validateRules(service: Service): void {
    if (!service.name.trim())
      throw new Error("O nome do serviço não pode ser vazio");

    if (service.price !== undefined && service.price < 0)
      throw new Error("O preço não pode ser negativo");
  }
}
export const serviceService = new ServiceService();
