import type { CalendarEvent } from "../entities/calendar";

// CalendarEvent has no auto-generated fields except id
export type CreateCalendarEventDTO = Omit<CalendarEvent, "id">;
export type UpdateCalendarEventDTO = Partial<Omit<CalendarEvent, "id">>;
