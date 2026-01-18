import { assert } from "../rules/common.rules";
import type { Service } from "../types";
import type { ServiceRepository } from "./types";

export interface CreateServiceInput {
  name: string;
  price?: number;
  notes?: string;
}

export interface UpdateServiceInput {
  id: number;
  name?: string;
  price?: number;
  notes?: string;
}

export async function createService(
  input: CreateServiceInput,
  deps: { serviceRepo: ServiceRepository }
) {
  assert(input.name.trim().length > 0, "Service name is required");

  if (input.price !== undefined)
    assert(
      Number.isFinite(input.price) && input.price >= 0,
      "Service price must be a non-negative number"
    );

  const service: Service = {
    id: 0,
    name: input.name,
    price: input.price,
    active: true,
    notes: input.notes,
  };

  return await deps.serviceRepo.create(service);
}

export async function updateService(
  input: UpdateServiceInput,
  deps: { serviceRepo: ServiceRepository }
): Promise<Service> {
  const service = await deps.serviceRepo.findById(input.id);
  assert(!!service, "Service not found");

  const updatedService: Service = {
    ...service!,
    ...input,
  };

  await deps.serviceRepo.update(updatedService);
  return updatedService;
}

export async function deactivateService(
  serviceId: number,
  deps: { serviceRepo: ServiceRepository }
): Promise<void> {
    const service = await deps.serviceRepo.findById(serviceId);
    assert(!!service, "Service not found");

    await deps.serviceRepo.update({...service!, active: false});
};

export async function activateService(
  serviceId: number,
  deps: { serviceRepo: ServiceRepository }
): Promise<void> {
    const service = await deps.serviceRepo.findById(serviceId);
    assert(!!service, "Service not found");

    await deps.serviceRepo.update({...service!, active: true});
};