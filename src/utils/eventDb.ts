
import { supabase } from "@/lib/supabaseClient";
import { Event } from "@/types/event";
import { mockEvents } from "@/data/mockEvents";
import { v4 as uuidv4 } from "uuid";
import { addEvent, getStoredEvents, updateStoredEvent, removeStoredEvent } from "@/utils/eventStorage";

export const saveEvent = async (eventData: Omit<Event, "id" | "attendees">): Promise<Event | null> => {
  try {
    await createEventsTableIfNotExists();
    
    // Try to save to Supabase first
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{ ...eventData, attendees: [] }])
        .select()
        .single();

      if (error) {
        // If there's an error with Supabase, throw to trigger the fallback
        throw error;
      }

      return data;
    } catch (supabaseError) {
      console.error('Supabase operation failed, using local storage:', supabaseError);
      
      // Fallback to localStorage
      const newEvent: Event = {
        id: uuidv4(),
        ...eventData,
        attendees: []
      };
      
      addEvent(newEvent);
      return newEvent;
    }
  } catch (error) {
    console.error('Operation failed:', error);
    throw error;
  }
};

export const getEvents = async (): Promise<Event[]> => {
  try {
    await createEventsTableIfNotExists();

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*');

      if (error) {
        throw error;
      }

      return data || [];
    } catch (supabaseError) {
      console.error('Supabase fetch failed, using local storage:', supabaseError);
      
      // Fallback to local storage
      const localEvents = getStoredEvents();
      
      // If no local events, use mock data and save them to local storage
      if (localEvents.length === 0) {
        mockEvents.forEach(event => addEvent(event));
        return getStoredEvents();
      }
      
      return localEvents;
    }
  } catch (error) {
    console.error('Database operation failed:', error);
    return getStoredEvents().length > 0 ? getStoredEvents() : mockEvents;
  }
};

export const updateEvent = async (eventId: string, updatedData: Partial<Event>): Promise<Event | null> => {
  try {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(updatedData)
        .eq('id', eventId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (supabaseError) {
      console.error('Supabase update failed, using local storage:', supabaseError);
      
      // Fallback to localStorage
      return updateStoredEvent(eventId, updatedData);
    }
  } catch (error) {
    console.error('Database operation failed:', error);
    return updateStoredEvent(eventId, updatedData);
  }
};

export const deleteEvent = async (eventId: string): Promise<boolean> => {
  try {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) {
        throw error;
      }

      return true;
    } catch (supabaseError) {
      console.error('Supabase delete failed, using local storage:', supabaseError);
      
      // Fallback to localStorage
      return removeStoredEvent(eventId);
    }
  } catch (error) {
    console.error('Database operation failed:', error);
    return removeStoredEvent(eventId);
  }
};

export const createEventsTableIfNotExists = async (): Promise<void> => {
  try {
    const { error: checkError } = await supabase
      .from('events')
      .select('id')
      .limit(1)
      .maybeSingle();
    
    if (!checkError) {
      console.log('Events table already exists');
      return;
    }
    
    if (checkError.code === '42P01') {
      // Table doesn't exist, but we can't create it directly with the Supabase JS client
      console.log('Events table does not exist');
      
      // Since we can't create tables directly with the JS client, we need to handle this case
      console.log('Using local storage as fallback - table creation requires Supabase dashboard');
      
      // Log a helpful message for the user about table creation
      console.log('To create the events table:');
      console.log('1. Go to your Supabase dashboard');
      console.log('2. Navigate to the SQL Editor');
      console.log('3. Run the following SQL:');
      console.log(`
        CREATE TABLE IF NOT EXISTS events (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          date TEXT NOT NULL,
          time TEXT NOT NULL,
          location TEXT NOT NULL,
          organizer TEXT NOT NULL,
          imageUrl TEXT,
          category TEXT NOT NULL,
          price NUMERIC DEFAULT 0,
          attendees JSONB DEFAULT '[]'::jsonb,
          admissionFree BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      `);
      
      // For development purposes, we'll fall back to local storage
      return;
    } else {
      console.error('Unknown error checking events table:', checkError);
    }
  } catch (error) {
    console.error('Error creating events table:', error);
  }
};

export const createInitialEvents = async (): Promise<void> => {
  try {
    // First check if events already exist
    const eventsExist = await checkEventsExist();
    
    if (eventsExist) {
      console.log('Events already exist, skipping initial creation');
      return;
    }
    
    console.log('Inserting mock events into database');
    try {
      const { error } = await supabase
        .from('events')
        .insert(mockEvents);

      if (error) {
        throw error;
      }

      console.log('Initial events created successfully');
    } catch (supabaseError) {
      console.error('Failed to create initial events in Supabase, using local storage:', supabaseError);
      
      // Fallback to local storage
      mockEvents.forEach(event => addEvent(event));
    }
  } catch (error) {
    console.error('Failed to create initial events:', error);
    
    // Final fallback
    mockEvents.forEach(event => addEvent(event));
  }
};

export const checkEventsExist = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('id')
      .limit(1);

    if (error) throw error;
    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking events:', error);
    
    // Check local storage instead
    const localEvents = getStoredEvents();
    return localEvents && localEvents.length > 0;
  }
};
