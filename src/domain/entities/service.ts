// Services have no stock and can ONLY be used in Sales (not Purchases)
export type Service = {
  id: number;
  name: string;
  price?: number;
  active: boolean; // Soft-delete: inactive remains in history, cannot be used in new records
  notes?: string;
};
