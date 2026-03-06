import { calendarService } from "@/domain/services/CalendarService";
import type { LoaderFunctionArgs } from "react-router";

export async function calendarDetailLoader({ params }: LoaderFunctionArgs) {
    const id = Number(params.id);
    if(isNaN(id)) throw new Error("Invalid calendar event id");

    return await calendarService.getById(id);
}