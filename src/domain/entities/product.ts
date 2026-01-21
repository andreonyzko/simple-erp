export type Product = {
  id: number;
  name: string;
  supplierId?: number;
  stockControl: boolean;
  stock?: number; // stock only exists if stockControl be true, and can be changed by Sale or Purchase
  cost?: number;
  sellPrice?: number;
  active: boolean;
  notes?: string;
};