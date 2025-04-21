
import { format, parse } from "date-fns";
import { Event } from "@/types/event";

// Check if a ticket is free or paid.
export const isTicketFree = (event: Event) => {
  return event?.admissionFree === true || !event?.price || event?.price === 0;
};

export const getTicketPrice = (event: Event) => {
  return typeof event?.price === "number" ? event.price : 0;
};

export const displayDate = (dateString: string) => {
  try {
    const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());
    return format(parsedDate, "EEEE, MMMM d, yyyy");
  } catch {
    return dateString;
  }
};
