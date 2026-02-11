import type {
  CreateCalendarEventDTO,
  UpdateCalendarEventDTO,
} from "../dtos/CalendarEventDTO";
import type { CalendarEvent } from "../entities/calendar";
import { calendarRepository } from "../repositories/CalendarRepository";

type CalendarFilters = {
  text?: string;
  dateRange: {
    start: Date;
    end: Date;
  };
};

class CalendarService {
  async create(data: CreateCalendarEventDTO): Promise<number> {
    // Build full entity to apply business rules before persist
    const event: CalendarEvent = {
      ...data,
      id: 0,
    };
    this.validateRules(event);

    return await calendarRepository.create(data);
  }
  async update(id: number, data: UpdateCalendarEventDTO): Promise<number> {
    const current = await calendarRepository.findById(id);

    // Merge preserving immutable fields (id)
    const updated: CalendarEvent = {
      ...current,
      ...data,
      id: current.id,
    };

    this.validateRules(updated);

    return await calendarRepository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    return await calendarRepository.delete(id);
  }

  async list(filters: CalendarFilters): Promise<CalendarEvent[]> {
    // 1. Apply indexed filter (period)
    let events = await calendarRepository.listByPeriod(
      filters.dateRange.start,
      filters.dateRange.end
    );

    // 2. Filter by text (title search, applied in-memory)
    if (filters.text?.trim())
      events = events.filter((e) =>
        e.title.toLowerCase().includes(filters.text!.toLowerCase())
      );

    return events;
  }

  async getById(id: number): Promise<CalendarEvent> {
    return await calendarRepository.findById(id);
  }
  private validateRules(event: CalendarEvent): void {
    if (!event.title.trim())
      throw new Error("O título do evento não pode ser vazio");
  }
}
export const calendarService = new CalendarService();
