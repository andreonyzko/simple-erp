// Machine state for Sales and Purchases
// Valid transitions: open → closed, open → canceled, closed → canceled
// Invalid transitions: canceled → any, closed → open
export type SalePurchaseStatus = "open" | "closed" | "canceled";
