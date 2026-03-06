import { serviceService } from "@/domain/services/ServiceService";
import type { LoaderFunctionArgs } from "react-router";

export async function servicesListLoader({ request }: LoaderFunctionArgs) {
  const getParam = new URL(request.url).searchParams.get;

  const search = getParam("search") || undefined;

  const activeParam = getParam("active");
  const active = activeParam === null ? undefined : activeParam === "true";

  const priceMinParam = getParam("min");
  const priceMaxParam = getParam("max");
  const price = {
    min: priceMinParam ? Number(priceMinParam) : 0,
    max: priceMaxParam ? Number(priceMaxParam) : undefined,
  };

  const services = await serviceService.list({ search, active, price });

  return { services };
}
