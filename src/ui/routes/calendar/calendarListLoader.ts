import { calendarService } from "@/domain/services/CalendarService";
import { endOfMonth, startOfMonth } from "date-fns";
import type { LoaderFunctionArgs } from "react-router";

export async function calendarListLoader({ request }: LoaderFunctionArgs) {
  const getParam = new URL(request.url).searchParams.get;

  const search = getParam("search") || undefined;
  const from = getParam("from") ?? startOfMonth(new Date()).toISOString();
  const to = getParam("to") ?? endOfMonth(new Date()).toISOString();

  const events = await calendarService.list({
    search,
    dateRange: {
      start: from,
      end: to,
    },
  });

  return { events };
}
