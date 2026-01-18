import { assert } from "../rules/common.rules";
import type { CalendarEvent } from "../types";
import type { CalendarRepository } from "./types";

export interface CreateCalendarEventInput {
  title: string;
  description?: string;
  start: Date;
  end?: Date;
}

export interface UpdateCalendarEventInput {
  id: number;
  title?: string;
  description?: string;
  start?: Date;
  end?: Date;
}

export async function createCalendarEvent(
  input: CreateCalendarEventInput,
  deps: { calendarRepo: CalendarRepository }
): Promise<CalendarEvent> {
  assert(input.title.trim().length > 0, "Event title is required!");
  assert(input.start instanceof Date, "Start date is required");

  if (input.end)
    assert(input.end >= input.start, "End date must be after start date");

  const event: CalendarEvent = {
    id: 0,
    title: input.title,
    description: input.description,
    start: input.start,
    end: input.end,
  };

  return await deps.calendarRepo.create(event);
}

export async function updateCalendarEvent(
  input: UpdateCalendarEventInput,
  deps: { calendarRepo: CalendarRepository }
): Promise<CalendarEvent> {
  const event = await deps.calendarRepo.findById(input.id);
  assert(!!event, "Calendar event not found!");

  const updatedEvent: CalendarEvent = {
    ...event!,
    ...input,
  };

  if (updatedEvent.end)
    assert(
      updatedEvent.end >= updatedEvent.start,
      "End date must be after start date"
    );

  await deps.calendarRepo.update(updatedEvent);
  return updatedEvent;
}

export async function deleteCalendarEvent(
  eventId: number,
  deps: { calendarRepo: CalendarRepository }
): Promise<void> {
    const event = await deps.calendarRepo.findById(eventId);
    assert(!!event, "Calendar event not found");
    await deps.calendarRepo.deleteById(event!.id);
}
