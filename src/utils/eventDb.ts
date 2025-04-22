
import { supabase } from "@/lib/supabaseClient";
import { Event } from "@/types/event";
import { mockEvents } from "@/data/mockEvents";

export const saveEvent = async (eventData: Omit<Event, "id" | "attendees">): Promise<Event | null> => {
  try {
    await createEventsTableIfNotExists();
    
    const { data, error } = await supabase
      .from('events')
      .insert([{ ...eventData, attendees: [] }])
      .select()
      .single();

    if (error) {
      console.error('Error saving event:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Database operation failed:', error);
    throw error;
  }
};

export const getEvents = async (): Promise<Event[]> => {
  try {
    await createEventsTableIfNotExists();

    const { data, error } = await supabase
      .from('events')
      .select('*');

    if (error) {
      console.error('Error fetching events:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Database operation failed:', error);
    return mockEvents;
  }
};

export const updateEvent = async (eventId: string, updatedData: Partial<Event>): Promise<Event | null> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .update(updatedData)
      .eq('id', eventId)
      .select()
      .single();

    if (error) {
      console.error('Error updating event:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Database operation failed:', error);
    throw error;
  }
};

export const deleteEvent = async (eventId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) {
      console.error('Error deleting event:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Database operation failed:', error);
    throw error;
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
      console.log('Using mock data as fallback - table creation requires Supabase dashboard');
      
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
      
      // For development purposes, we'll fall back to mock data
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
    const { error } = await supabase
      .from('events')
      .insert(mockEvents);

    if (error) {
      console.error('Error creating initial events:', error);
      throw error;
    }

    console.log('Initial events created successfully');
  } catch (error) {
    console.error('Failed to create initial events:', error);
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
    return false;
  }
};
