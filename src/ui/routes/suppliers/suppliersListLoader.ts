import { supplierService } from "@/domain/services/SupplierService";
import type { LoaderFunctionArgs } from "react-router";

export async function suppliersListLoader({ request }: LoaderFunctionArgs) {
  const getParam = new URL(request.url).searchParams.get;

  const search = getParam("search") || undefined;

  const activeParam = getParam("active");
  const active = activeParam === null ? undefined : activeParam === "true";

  const debtsMinParam = getParam("minDebt");
  const debtsMaxParam = getParam("maxDebt");
  const debts = {
    min: debtsMinParam ? Number(debtsMinParam) : 0,
    max: debtsMaxParam ? Number(debtsMaxParam) : undefined,
  };

  const suppliers = await supplierService.list({ search, active, debts });

  return { suppliers };
}
