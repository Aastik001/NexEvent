
import { supabase } from "@/lib/supabaseClient";
import { Event } from "@/types/event";

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
  const { data, error } = await supabase
    .from('events')
    .insert([{ ...eventData, attendees: [] }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*');

  if (error) throw error;
  return data || [];
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
