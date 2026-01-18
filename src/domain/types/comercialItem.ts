import type { ComercialItemType } from "./common";

export type ComercialItem = {
  id: number;
  type: ComercialItemType;
  referenceId: number;
  quantity: number;
  unitValue: number;
};