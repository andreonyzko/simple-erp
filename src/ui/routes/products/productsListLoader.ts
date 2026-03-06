import { productService } from "@/domain/services/ProductService";
import type { StockStatus } from "@/domain/types/Stock";
import type { LoaderFunctionArgs } from "react-router";

export async function productsListLoader({ request }: LoaderFunctionArgs) {
  const getParam = new URL(request.url).searchParams.get;
  const search = getParam("search") || undefined;

  const activeParam = getParam("active");
  const active = activeParam === null ? undefined : activeParam === "true";

  const stockParam = getParam("stock");
  const stock: StockStatus | undefined =
    stockParam === "no-control" ||
    stockParam === "in-stock" ||
    stockParam === "out-stock"
      ? stockParam
      : undefined;

  const costMinParam = getParam("minCost");
  const costMaxParam = getParam("maxCost");
  const cost = {
    min: costMinParam ? Number(costMinParam) : 0,
    max: costMaxParam ? Number(costMaxParam) : undefined,
  };

  const sellPriceMinParam = getParam("minSell");
  const sellPriceMaxParam = getParam("maxSell");
  const sellPrice = {
    min: sellPriceMinParam ? Number(sellPriceMinParam) : 0,
    max: sellPriceMaxParam ? Number(sellPriceMaxParam) : undefined,
  };

  const products = await productService.list({
    search,
    active,
    cost,
    sellPrice,
    stock,
  });

  return { products };
}
