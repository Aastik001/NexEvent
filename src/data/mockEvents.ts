
import { Event } from '../types/event';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Conference 2025',
    description: 'Join us for the biggest tech conference of the year with industry leaders and innovators.',
    date: '2025-06-15',
    time: '09:00',
    location: 'Convention Center, Downtown',
    organizer: 'Tech Events Inc.',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2070',
    attendees: ['user1', 'user2', 'user3'],
    category: 'business',
  },
  {
    id: '2',
    title: 'Summer Music Festival',
    description: 'A weekend of amazing music performances, food, and fun activities for everyone.',
    date: '2025-07-10',
    time: '16:00',
    location: 'City Park',
    organizer: 'Music Events Co.',
    imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070',
    attendees: ['user2', 'user4'],
    category: 'social',
  },
  {
    id: '3',
    title: 'Workshop: Digital Marketing',
    description: 'Learn the latest digital marketing strategies from experts in the field.',
    date: '2025-05-22',
    time: '13:30',
    location: 'Business Center',
    organizer: 'Marketing Pros',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070',
    attendees: ['user1', 'user5'],
    category: 'education',
  },
  {
    id: '4',
    title: 'Charity Gala Dinner',
    description: 'Annual fundraising dinner to support local community initiatives.',
    date: '2025-08-05',
    time: '19:00',
    location: 'Grand Hotel Ballroom',
    organizer: 'Community Foundation',
    imageUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=2070',
    attendees: ['user3', 'user4', 'user5'],
    category: 'social',
  },
  {
    id: '5',
    title: 'AI and Machine Learning Summit',
    description: 'Explore cutting-edge AI technologies and network with industry experts.',
    date: '2025-09-20',
    time: '10:00',
    location: 'Tech Innovation Center',
    organizer: 'AI Innovations LLC',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070',
    attendees: ['user1', 'user2', 'user4'],
    category: 'business',
  }
];
