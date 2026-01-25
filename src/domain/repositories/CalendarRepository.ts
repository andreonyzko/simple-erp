import { db } from "../../infra/database";
import type { CalendarEvent } from "../entities/calendar";

export type CalendarFilters = {
  dateRange: {
    start: Date;
    end: Date;
  };
};

export class CalendarRepository {
  // Create
  async create(event: CalendarEvent) {
    return await db.calendar.add(event);
  }

  // Update
  async update(updatedEvent: CalendarEvent) {
    return await db.calendar.put(updatedEvent);
  }
  
  // Delete
  async delete(id: number) {
    return await db.calendar.delete(id);
  }

  // Read
  async findById(id: number) {
    return await db.calendar.get(id);
  }
  async searchByTitle(title: string) {
    return await db.calendar
      .where("title")
      .startsWithIgnoreCase(title)
      .toArray();
  }

  async listByPeriod(start: Date, end: Date) {
    return await db.calendar
      .where("date")
      .between(start, end, true, true)
      .toArray();
  }

  async listAll() {
    return await db.calendar.toArray();
  }
}
