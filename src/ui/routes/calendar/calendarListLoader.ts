import { calendarService } from "@/domain/services/CalendarService";
import { endOfMonth, startOfMonth } from "date-fns";
import type { LoaderFunctionArgs } from "react-router";

export async function calendarListLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const search = url.searchParams.get("search") ?? undefined;
  const from =
    url.searchParams.get("from") ??
    startOfMonth(new Date()).toISOString().split("T")[0];
  const to =
    url.searchParams.get("to") ??
    endOfMonth(new Date()).toISOString().split("T")[0];

  const events = await calendarService.list({
    search,
    dateRange: {
      start: from,
      end: to,
    },
  });

  return { events };
}
