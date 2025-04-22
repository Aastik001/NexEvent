
import { Event } from "../types/event";
import { v4 as uuidv4 } from "uuid";

const EVENTS_STORAGE_KEY = "user_created_events";

// Original function (kept for backward compatibility)
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

// Add new function that matches the import in eventDb.ts
export const addEvent = (event: Event): Event => {
  const existingEvents = getEvents();
  existingEvents.push(event);
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(existingEvents));
  return event;
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

// Add alias for getStoredEvents to match the import in eventDb.ts
export const getStoredEvents = getEvents;

export const updateEvent = (eventId: string, updatedData: Partial<Event>): Event | null => {
  const events = getEvents();
  const eventIndex = events.findIndex(e => e.id === eventId);
  
  if (eventIndex === -1) return null;
  
  events[eventIndex] = {
    ...events[eventIndex],
    ...updatedData
  };
  
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  return events[eventIndex];
};

// Add alias for updateStoredEvent to match the import in eventDb.ts
export const updateStoredEvent = updateEvent;

export const deleteEvent = (eventId: string): boolean => {
  const events = getEvents();
  const filteredEvents = events.filter(e => e.id !== eventId);
  
  if (filteredEvents.length === events.length) return false;
  
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(filteredEvents));
  return true;
};

// Add alias for removeStoredEvent to match the import in eventDb.ts
export const removeStoredEvent = deleteEvent;
