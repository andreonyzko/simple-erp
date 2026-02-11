// Base type for Client and Supplier (both share the same structure)
export type Person = {
  id: number;
  name: string;

  document?: string; // CPF or CNPJ
  address?: string;
  phone?: string;
  notes?: string;

  active: boolean; // Soft-delete: inactive remains in history, cannot be used in new records
  createdAt: Date; // Immutable after creation
};

export type Client = Person;
export type Supplier = Person;
