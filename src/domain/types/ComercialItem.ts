export type ComercialItemType = "product" | "service";
export type ComercialItem = {
  id: number;
  type: ComercialItemType;
  referenceId: number;
  name: string;
  quantity: number;
  unitValue: number;
};
