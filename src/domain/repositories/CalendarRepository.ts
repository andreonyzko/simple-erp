import { db } from "@/infra/database";
import type {
  CreateCalendarEventDTO,
  UpdateCalendarEventDTO,
} from "../dtos/CalendarEventDTO";
import type { CalendarEvent } from "../entities/calendar";

class CalendarRepository {
  async create(data: CreateCalendarEventDTO): Promise<number> {
    return await db.calendar.add(data as CalendarEvent);
  }

  async update(id: number, data: UpdateCalendarEventDTO): Promise<number> {
    const updated = await db.calendar.update(id, data);
    if (updated === 0) throw new Error("Nenhum evento foi atualizado");

    return updated;
  }

  async delete(id: number): Promise<void> {
    const event = await db.calendar.get(id);
    if (!event) throw new Error("Evento não encontrado");

    await db.calendar.delete(id);
  }

  async findById(id: number): Promise<CalendarEvent> {
    const event = await db.calendar.get(id);
    if (!event) throw new Error("Evento não encontrado");

    return event;
  }

  // Search by title (uses indexed field)
  async searchByText(text: string): Promise<CalendarEvent[]> {
    if (!text.trim()) throw new Error("O texto de busca não pode ser vazio");

    return await db.calendar
      .where("title")
      .startsWithIgnoreCase(text)
      .toArray();
  }

  async listByPeriod(start: Date, end: Date): Promise<CalendarEvent[]> {
    if (start > end)
      throw new Error("Data inicial não pode ser maior que a final");

    return await db.calendar
      .where("date")
      .between(start, end, true, true)
      .toArray();
  }

  async listAll(): Promise<CalendarEvent[]> {
    return await db.calendar.toArray();
  }
}

export const calendarRepository = new CalendarRepository();
