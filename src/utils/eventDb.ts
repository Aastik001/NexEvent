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
      // Table doesn't exist, create it using SQL
      console.log('Creating events table using SQL');
      
      const createTableSQL = `
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
      `;
      
      const { error } = await supabase.sql(createTableSQL);
      
      if (error) {
        console.error('Failed to create events table with SQL:', error);
        
        // If sql approach fails, suggest the user to create the table manually
        console.log('Please create the events table manually in your Supabase dashboard');
        return;
      } else {
        console.log('Events table created successfully');
        await createInitialEvents();
      }
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
