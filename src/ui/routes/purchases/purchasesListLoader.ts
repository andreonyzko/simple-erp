import { purchaseService } from "@/domain/services/PurchaseService";
import type { PaymentStatus } from "@/domain/types/Payment";
import type { SalePurchaseStatus } from "@/domain/types/SalePurchaseStatus";
import { endOfMonth, startOfMonth } from "date-fns";
import type { LoaderFunctionArgs } from "react-router";

export async function purchasesListLoader({ request }: LoaderFunctionArgs) {
  const getParam = new URL(request.url).searchParams.get;

  const from = getParam("from") ?? startOfMonth(new Date()).toISOString();
  const to = getParam("to") ?? endOfMonth(new Date()).toISOString();
  const dateRange = {
    start: from,
    end: to,
  };

  const search = getParam("search") || undefined;

  const statusParam = getParam("status");
  const status: SalePurchaseStatus | undefined =
    statusParam === "open" ||
    statusParam === "closed" ||
    statusParam === "canceled"
      ? statusParam
      : undefined;

  const paymentStatusParam = getParam("paymentStatus");
  const paymentStatus: PaymentStatus | undefined =
    paymentStatusParam === "pending" ||
    paymentStatusParam === "partial" ||
    paymentStatusParam === "paid"
      ? paymentStatusParam
      : undefined;

  const totalValueMinParam = getParam("min");
  const totalValueMaxParam = getParam("max");
  const totalValue = {
    min: totalValueMinParam ? Number(totalValueMinParam) : 0,
    max: totalValueMaxParam ? Number(totalValueMaxParam) : undefined,
  };

  const purchases = await purchaseService.list({
    dateRange,
    search,
    status,
    paymentStatus,
    totalValue,
  });

  return { purchases };
}
