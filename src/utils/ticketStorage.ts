
import { v4 as uuidv4 } from "uuid";

interface Ticket {
  id: string;
  eventName: string;
  eventDate: string;
  seat: string;
  code: string;
  userId: string;
}

const TICKETS_STORAGE_KEY = "user_booked_tickets";

export const saveTicket = (userId: string, eventName: string, eventDate: string): Ticket => {
  // Create a ticket object
  const newTicket: Ticket = {
    id: uuidv4(),
    eventName,
    eventDate,
    seat: generateRandomSeat(),
    code: `TCKT-${Math.floor(Math.random() * 900000) + 100000}`,
    userId
  };

  // Get existing tickets
  const existingTickets = getTickets();
  
  // Add the new ticket
  existingTickets.push(newTicket);
  
  // Save back to localStorage
  localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(existingTickets));
  
  return newTicket;
};

export const getTickets = (): Ticket[] => {
  try {
    const ticketsJson = localStorage.getItem(TICKETS_STORAGE_KEY);
    if (ticketsJson) {
      return JSON.parse(ticketsJson);
    }
  } catch (error) {
    console.error("Error retrieving tickets from storage:", error);
  }
  return [];
};

export const getTicketsByUser = (userId: string): Ticket[] => {
  const allTickets = getTickets();
  return allTickets.filter(ticket => ticket.userId === userId);
};

// Helper function to generate a random seat
const generateRandomSeat = (): string => {
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const row = rows[Math.floor(Math.random() * rows.length)];
  const number = Math.floor(Math.random() * 20) + 1;
  return `${row}${number}`;
};
