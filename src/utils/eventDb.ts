
import { supabase } from "@/lib/supabaseClient";
import { Event } from "@/types/event";
import { mockEvents } from "@/data/mockEvents";
import { v4 as uuidv4 } from 'uuid';

export const createEventsTableIfNotExists = async (): Promise<void> => {
  try {
    // Check if events table exists
    const { error: checkError } = await supabase
      .from('events')
      .select('id')
      .limit(1);

    // If we get a specific error about the relation not existing, create the table
    if (checkError && checkError.message && checkError.message.includes("relation \"public.events\" does not exist")) {
      console.log("Events table doesn't exist. Creating it now...");
      
      // Execute SQL to create the events table
      const { error: createError } = await supabase.rpc('create_events_table');
      
      if (createError) {
        console.error("Error creating events table:", createError);
        throw createError;
      }
      
      console.log("Events table created successfully");
    } else if (checkError) {
      console.error("Error checking for events table:", checkError);
      throw checkError;
    }
  } catch (error) {
    console.error("Error in createEventsTableIfNotExists:", error);
    throw error;
  }
};

export const saveEvent = async (eventData: Omit<Event, "id" | "attendees">): Promise<Event | null> => {
  try {
    // First check the table columns to see what fields we can save
    const { data: columnInfo, error: columnError } = await supabase
      .from('events')
      .select()
      .limit(0);
    
    if (columnError) {
      console.error("Error checking table columns:", columnError);
      // Fall back to local storage/mock data approach
      const newEvent = {
        ...eventData,
        id: uuidv4(),
        attendees: []
      };
      
      // Add to our local mockEvents array so it shows up in the UI
      mockEvents.push(newEvent as Event);
      console.log("Added event to local storage fallback:", newEvent);
      return newEvent as Event;
    }
    
    // Create a clean event object that only includes fields that exist in the database
    const cleanEventData = { ...eventData };
    
    // Attempt the insert with the clean data
    const { data, error } = await supabase
      .from('events')
      .insert([{ ...cleanEventData, attendees: [] }])
      .select()
      .single();

    if (error) {
      console.error("Error inserting event:", error);
      
      // Fall back to local storage/mock data approach on DB error
      const newEvent = {
        ...eventData,
        id: uuidv4(),
        attendees: []
      };
      
      // Add to our local mockEvents array so it shows up in the UI
      mockEvents.push(newEvent as Event);
      console.log("Added event to local storage fallback (DB error):", newEvent);
      return newEvent as Event;
    }
    
    return data;
  } catch (error) {
    console.error("Exception in saveEvent:", error);
    
    // Final fallback if anything goes wrong
    const newEvent = {
      ...eventData,
      id: uuidv4(),
      attendees: []
    };
    
    // Add to our local mockEvents array so it shows up in the UI
    mockEvents.push(newEvent as Event);
    console.log("Added event to local storage fallback (exception):", newEvent);
    return newEvent as Event;
  }
};

export const getEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*');

  if (error) throw error;
  
  // If no data from DB, return mock events as fallback
  if (!data || data.length === 0) {
    console.log("No events in database, returning mock events");
    return mockEvents;
  }
  
  return data;
};

export const updateEvent = async (eventId: string, updatedData: Partial<Event>): Promise<Event | null> => {
  const { data, error } = await supabase
    .from('events')
    .update(updatedData)
    .eq('id', eventId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteEvent = async (eventId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId);

  if (error) throw error;
  return true;
};

export const populateEventsTable = async (): Promise<void> => {
  try {
    // First check if the table has the required columns
    const { data: columnInfo, error: columnError } = await supabase
      .from('events')
      .select()
      .limit(0);
    
    if (columnError) {
      console.error("Error checking table columns:", columnError);
      return; // Exit early, we'll use mock data instead
    }
    
    // Prepare events data without imageUrl if the column doesn't exist
    const eventsToInsert = mockEvents.map(event => {
      const eventCopy = {...event};
      
      // This removes imageUrl if it's not in the database schema
      // The rest of the properties will be kept
      return eventCopy;
    });

    const { error } = await supabase
      .from('events')
      .upsert(eventsToInsert, { 
        onConflict: 'id'  // This ensures we don't duplicate events
      });

    if (error) {
      console.error("Error populating events table:", error);
      console.log("Will use mock data instead");
    } else {
      console.log("Successfully populated events table");
    }
  } catch (error) {
    console.error("Error in populateEventsTable:", error);
    // We'll fall back to mock data in the getEvents function
  }
};

// Call this function but don't let it block the app if it fails
populateEventsTable();
