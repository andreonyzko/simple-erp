// Calendar events have no financial impact and don't relate to other entities
export type CalendarEvent = {
  id: number;
  title: string;
  description?: string;
  date: Date; // Can be past or future (no restriction)
};
