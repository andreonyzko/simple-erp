import { transactionService } from "@/domain/services/TransactionService";
import type {
  TransactionOrigin,
  TransactionType,
} from "@/domain/types/Transaction";
import { endOfMonth, startOfMonth } from "date-fns";
import type { LoaderFunctionArgs } from "react-router";

export async function transactionsListLoader({ request }: LoaderFunctionArgs) {
  const getParam = new URL(request.url).searchParams.get;

  const from = getParam("from") ?? startOfMonth(new Date()).toISOString();
  const to = getParam("to") ?? endOfMonth(new Date()).toISOString();
  const dateRange = {
    start: from,
    end: to,
  };

  const search = getParam("search") || undefined;

  const originParam = getParam("origin");
  const origin: TransactionOrigin | undefined =
    originParam === "purchase" ||
    originParam === "sale" ||
    originParam === "manual"
      ? originParam
      : undefined;

  const typeParam = getParam("type");
  const type: TransactionType | undefined =
    typeParam === "in" || typeParam === "out" ? typeParam : undefined;

  const valueMinParam = getParam("min");
  const valueMaxParam = getParam("max");
  const value = {
    min: valueMinParam ? Number(valueMinParam) : 0,
    max: valueMaxParam ? Number(valueMaxParam) : undefined,
  };

  const transactions = await transactionService.list({
    dateRange,
    search,
    origin,
    type,
    value,
  });

  return { transactions };
}
