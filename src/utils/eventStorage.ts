
import { Event } from "../types/event";
import { v4 as uuidv4 } from "uuid";

const EVENTS_STORAGE_KEY = "user_created_events";

export const saveEvent = (eventData: Omit<Event, "id" | "attendees">): Event => {
  // Create a complete event object with id and empty attendees array
  const newEvent: Event = {
    ...eventData,
    id: uuidv4(),
    attendees: []
  };

  // Get existing events
  const existingEvents = getEvents();
  
  // Add the new event
  existingEvents.push(newEvent);
  
  // Save back to localStorage
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(existingEvents));
  
  return newEvent;
};

export const getEvents = (): Event[] => {
  try {
    const eventsJson = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (eventsJson) {
      return JSON.parse(eventsJson);
    }
  } catch (error) {
    console.error("Error retrieving events from storage:", error);
  }
  return [];
};
