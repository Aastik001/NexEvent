
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { getTicketsByUser } from "@/utils/ticketStorage";

interface Ticket {
  id: string;
  eventName: string;
  eventDate: string;
  seat: string;
  code: string;
  userId: string;
}

interface Props {
  userId: string;
}

const TicketList = ({ userId }: Props) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    // Get tickets from storage instead of the mock data
    setTickets(getTicketsByUser(userId));
    
    // Set up a listener for storage events to update tickets in real-time
    const handleStorageChange = () => {
      setTickets(getTicketsByUser(userId));
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // We also need to listen for our own custom event for cases when localStorage
    // is updated in the same window
    window.addEventListener('ticketsUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('ticketsUpdated', handleStorageChange);
    };
  }, [userId]);

  if (tickets.length === 0) {
    return <p className="my-6 text-muted-foreground">No tickets booked yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Seat</TableHead>
          <TableHead>Code</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map(ticket => (
          <TableRow key={ticket.id}>
            <TableCell>{ticket.eventName}</TableCell>
            <TableCell>{ticket.eventDate}</TableCell>
            <TableCell>{ticket.seat}</TableCell>
            <TableCell className="font-mono">{ticket.code}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TicketList;
