
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  imageUrl?: string;
  attendees: string[];
  category: 'business' | 'social' | 'education' | 'other';
  price?: number;
  admissionFree?: boolean;
}
