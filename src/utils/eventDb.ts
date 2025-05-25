// lib/db/eventsDb.ts

import { supabase } from "@/lib/supabaseClient";
import { Event, EventInput } from "@/types/event";

// --- Initialize the events table ---
export const initializeEventsTable = async (): Promise<void> => {
  try {
    const { error } = await supabase.rpc('initialize_events_table');

    if (error) {
      console.error("Initialization error:", {
        message: error.message,
        code: error.code,
        details: error.details
      });
      throw error;
    }

    // const { error: rlsError } = await supabase.rpc('enable_rls_and_policies');

    // if (rlsError) {
    //   console.error("RLS setup error:", rlsError);
    //   throw rlsError;
    // }
  } catch (error) {
    console.error("Failed to initialize events table:", error);
    throw error; // Re-throw error after logging
  }
};

// --- Save an event ---
export const saveEvent = async (eventData: EventInput, userId: string): Promise<Event> => {
  try {
    if (!eventData.title || !eventData.date) {
      throw new Error("Title and date are required");
    }

    const {
      imageUrl,
      admissionFree,
      ...rest
    } = eventData;

    const insertData = {
      ...rest,
      creator_id: userId,
      image_url: imageUrl ?? null,
      admissionfree: admissionFree ?? false,
      attendees: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('events')
      .insert([insertData])
      .select('*')
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }

    if (!data) {
      throw new Error("No data returned from insert");
    }

    return data as Event;
  } catch (error) {
    console.error("Failed to save event:", error);
    throw error;
  }
};

// --- Get all events ---
export const getEvents = async (): Promise<Event[]> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error("Supabase fetch error:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return []; // Return empty array on error to avoid breaking the app
  }
};

// --- Update an event ---
export const updateEvent = async (
  eventId: string,
  updates: Partial<Event>,
  userId: string
): Promise<Event> => {
  try {
    // First verify the event exists and user owns it
    const { data: existingEvent, error: verifyError } = await supabase
      .from('events')
      .select('creator_id')
      .eq('id', eventId)
      .single();

    if (verifyError) {
      throw new Error(`Verification failed: ${verifyError.message}`);
    }

    if (!existingEvent || existingEvent.creator_id !== userId) {
      throw new Error('Unauthorized: You can only edit your own events');
    }

    // Only allow updatable fields (do NOT include organizer or creator_id)
    const allowedFields = [
      'title',
      'description',
      'date',
      'time',
      'location',
      'category',
      'price',
      'image_url',
      'admissionfree'
    ];

    // Defensive: Only pick allowed fields from updates
    const cleanUpdates = Object.entries(updates)
      .filter(([key, value]) => allowedFields.includes(key) && value !== undefined)
      .reduce((acc, [key, value]) => {
        switch (key) {
          case 'price':
            return { ...acc, [key]: Number(value) };
          case 'admissionfree':
            return { ...acc, [key]: Boolean(value) };
          default:
            return { ...acc, [key]: String(value) };
        }
      }, {} as Record<string, any>);

    // Add updated_at timestamp
    const updateData = {
      ...cleanUpdates,
      updated_at: new Date().toISOString()
    };

    console.log("eventDb.ts: updateData being sent to Supabase:", updateData);

    // Perform the update with clean data
    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', eventId)
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      throw new Error(`Failed to update event: ${error.message}`);
    }

    if (!data) {
      throw new Error('Event not found after update');
    }

    return data as Event;
  } catch (error) {
    console.error('Update event error:', error);
    throw error;
  }
};

export const deleteEvent = async (eventId: string, userId: string): Promise<void> => {
  try {
    // First verify the creator
    const { data: existingEvent } = await supabase
      .from('events')
      .select('creator_id')
      .eq('id', eventId)
      .single();

    if (!existingEvent || existingEvent.creator_id !== userId) {
      throw new Error('Unauthorized: You can only delete your own events');
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to delete event:', error);
    throw error;
  }
};

// --- Ensure events table exists ---
export const createEventsTableIfNotExists = async (): Promise<void> => {
  try {
    await initializeEventsTable(); // Ensure initialization happens first
  } catch (error) {
    console.error("Error during events table creation:", error);
    throw error; // Re-throw error after logging
  }
};

// --- Initialize table when module loads ---
createEventsTableIfNotExists().catch(console.error);

