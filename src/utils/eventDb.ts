
import { supabase } from "@/lib/supabaseClient";
import { Event } from "@/types/event";

export const saveEvent = async (eventData: Omit<Event, "id" | "attendees">): Promise<Event | null> => {
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
};

export const getEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*');

  if (error) {
    console.error('Error fetching events:', error);
    throw error;
  }

  return data || [];
};

export const updateEvent = async (eventId: string, updatedData: Partial<Event>): Promise<Event | null> => {
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
};

export const deleteEvent = async (eventId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId);

  if (error) {
    console.error('Error deleting event:', error);
    throw error;
  }

  return true;
};
