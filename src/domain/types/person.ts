export type Client = Person;
export type Supplier = Person;
export type Person = {
  id: number;
  name: string;

  document?: string; // cpf/cnpj
  address?: string;
  phone?: string;
  notes?: string;

  active: boolean;
  createdAt: Date;
};