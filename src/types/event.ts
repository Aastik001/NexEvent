
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  image_url: string;
  admissionfree: boolean;
  attendees: string[];
  category: string;
  creator_id: string;  // Add this field
  price?: number;     // Make sure price is included if not already
}

export type EventInput = {
  title: string;
  description?: string;
  date: string;  // "YYYY-MM-DD"
  time?: string; // e.g. "18:00"
  location?: string;
  organizer?: string;
  imageUrl?: string; // camelCase
  admissionFree?: boolean; // camelCase
};

