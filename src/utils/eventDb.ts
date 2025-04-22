import { supabase } from "@/lib/supabaseClient";
import { Event } from "@/types/event";

export const saveEvent = async (eventData: Omit<Event, "id" | "attendees">): Promise<Event | null> => {
  try {
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
    throw error;
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

export const createInitialEvents = async (): Promise<void> => {
  const initialEvents = [
    {
      title: "Tech Conference 2025",
      description: "Join us for the biggest tech conference of the year. Learn about the latest technologies, network with industry leaders, and participate in hands-on workshops.",
      date: "2025-06-15",
      time: "09:00",
      location: "Silicon Valley Convention Center",
      organizer: "Tech Events Inc",
      imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      category: "business",
      price: 299,
      attendees: [],
      admissionFree: false
    },
    {
      title: "Summer Music Festival",
      description: "Experience a day filled with live music performances, food trucks, and entertainment. Perfect for families and music lovers of all ages.",
      date: "2025-07-20",
      time: "14:00",
      location: "Central Park",
      organizer: "City Events",
      imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
      category: "social",
      price: 0,
      attendees: [],
      admissionFree: true
    },
    {
      title: "Data Science Workshop",
      description: "Learn practical data science skills from industry experts. Topics include machine learning, data visualization, and statistical analysis.",
      date: "2025-05-10",
      time: "10:00",
      location: "Digital Learning Center",
      organizer: "Data Science Academy",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      category: "education",
      price: 149,
      attendees: [],
      admissionFree: false
    },
    {
      title: "Community Garden Day",
      description: "Help plant and maintain our community garden. Learn about sustainable gardening practices and take home fresh produce.",
      date: "2025-04-30",
      time: "08:00",
      location: "Community Gardens",
      organizer: "Green Initiatives",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      category: "other",
      price: 0,
      attendees: [],
      admissionFree: true
    }
  ];

  try {
    const { error } = await supabase
      .from('events')
      .insert(initialEvents);

    if (error) {
      console.error('Error creating initial events:', error);
      throw error;
    }

    console.log('Initial events created successfully');
  } catch (error) {
    console.error('Failed to create initial events:', error);
    throw error;
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
