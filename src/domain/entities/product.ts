export type Product = {
  id: number;
  name: string;
  supplierId?: number;
  stockControl: boolean; // If false, stock field is ignored
  stock?: number; // Only controlled if stockControl = true; NEVER negative
  cost?: number;
  sellPrice?: number;
  active: boolean; // Soft-delete: inactive remains in history, cannot be used in new records
  notes?: string;
};
