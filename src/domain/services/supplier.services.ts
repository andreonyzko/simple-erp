import type { Supplier } from "../entities/person";
import { assert } from "../rules/common.rules";
import type { SupplierRepository } from "./types";

export interface CreateSupplierInput {
  name: string;
  document?: string;
  address?: string;
  phone?: string;
  notes?: string;
}

export interface UpdateSupplierInput {
  id: number;
  name?: string;
  document?: string;
  address?: string;
  phone?: string;
  notes?: string;
}

export async function createSupplier(
  input: CreateSupplierInput,
  deps: { supplierRepo: SupplierRepository }
): Promise<Supplier> {
  assert(input.name.trim().length > 0, "Supplier name is required");

  const supplier: Supplier = {
    id: 0,
    name: input.name,
    document: input.document,
    address: input.address,
    phone: input.phone,
    notes: input.notes,
    active: true,
    createdAt: new Date(),
  };

  return await deps.supplierRepo.create(supplier);
}

export async function updateSupplier(
  input: UpdateSupplierInput,
  deps: { supplierRepo: SupplierRepository }
): Promise<Supplier> {
  const supplier = await deps.supplierRepo.findById(input.id);
  assert(!!supplier, "Supplier not found");

  const updatedSupplier: Supplier = {
    ...supplier!,
    ...input,
  };

  await deps.supplierRepo.update(updatedSupplier);
  return updatedSupplier;
}

export async function deactivateService(
  supplierId: number,
  deps: { supplierRepo: SupplierRepository }
): Promise<void> {
  const supplier = await deps.supplierRepo.findById(supplierId);
  assert(!!supplier, "Supplier not found");

  await deps.supplierRepo.update({ ...supplier!, active: false });
}

export async function activateSupplier(
  supplierId: number,
  deps: { supplierRepo: SupplierRepository }
): Promise<void> {
    const supplier = await deps.supplierRepo.findById(supplierId);
    assert(!!supplier, "Supplier not found");

    await deps.supplierRepo.update({...supplier!, active: true});
}
