import type { Client } from "../entities/person";
import { assert } from "../rules/common.rules";
import type { ClientRepository } from "./types";

export interface CreateClientInput {
  name: string;
  document?: string;
  address?: string;
  phone?: string;
  notes?: string;
}

export interface UpdateClientInput {
  id: number;
  name?: string;
  document?: string;
  address?: string;
  phone?: string;
  notes?: string;
}

export async function createClient(
  input: CreateClientInput,
  deps: { clientRepo: ClientRepository }
): Promise<Client> {
  assert(input.name.trim().length > 0, "Client name is required");

  const client: Client = {
    id: 0,
    name: input.name,
    document: input.document,
    address: input.address,
    phone: input.phone,
    notes: input.notes,
    active: true,
    createdAt: new Date(),
  };

  return await deps.clientRepo.create(client);
}

export async function updateClient(
  input: UpdateClientInput,
  deps: { clientRepo: ClientRepository }
): Promise<Client> {
  const client = await deps.clientRepo.findById(input.id);
  assert(!!client, "Client not found");

  const updatedClient: Client = {
    ...client!,
    ...input,
  };

  await deps.clientRepo.update(updatedClient);
  return updatedClient;
}

export async function deactivateService(
  clientId: number,
  deps: { clientRepo: ClientRepository }
): Promise<void> {
  const client = await deps.clientRepo.findById(clientId);
  assert(!!client, "Client not found");

  await deps.clientRepo.update({ ...client!, active: false });
}

export async function activateClient(
  clientId: number,
  deps: { clientRepo: ClientRepository }
): Promise<void> {
    const client = await deps.clientRepo.findById(clientId);
    assert(!!client, "Client not found");

    await deps.clientRepo.update({...client!, active: true});
}
