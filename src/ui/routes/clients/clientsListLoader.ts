import { clientService } from "@/domain/services/ClientService";
import type { LoaderFunctionArgs } from "react-router";

export async function clientsListLoader({ request }: LoaderFunctionArgs) {
  const getParam = new URL(request.url).searchParams.get;

  const search = getParam("search") || undefined;

  const activeParam = getParam("active");
  const active = activeParam === null ? undefined : activeParam === "true";

  const debtMinParam = getParam("minDebt");
  const debtMaxParam = getParam("maxDebt");
  const debts = {
    min: debtMinParam ? Number(debtMinParam) : 0,
    max: debtMaxParam ? Number(debtMaxParam) : undefined,
  };

  const clients = await clientService.list({
    search,
    active,
    debts,
  });

  return { clients };
}
