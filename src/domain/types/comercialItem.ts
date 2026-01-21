import type { ComercialItemType } from "./ComercialItemType";

export type ComercialItem = {
  id: number;
  type: ComercialItemType;
  referenceId: number;
  quantity: number;
  unitValue: number;
};