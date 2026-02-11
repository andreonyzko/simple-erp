export type ComercialItemType = "product" | "service";

// Represents a product or service within a Sale or Purchase
export type ComercialItem = {
  id: number;
  type: ComercialItemType;
  referenceId: number; // Links to Product.id or Service.id
  name: string; // Denormalized for display (avoids joins)
  quantity: number;
  unitValue: number;
};
