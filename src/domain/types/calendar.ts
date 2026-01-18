export type CalendarEvent = {
  id: number;
  title: string;
  description?: string;
  start: Date;
  end?: Date;
};