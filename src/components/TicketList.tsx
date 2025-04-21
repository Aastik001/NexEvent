
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { useEffect, useState } from "react";

// Mocked tickets per user id
const TICKETS = [
  {
    id: "t1",
    eventName: "Tech Conference 2025",
    eventDate: "2025-07-15",
    seat: "A3",
    userId: "user-1",
    code: "TCKT-1234715"
  },
  {
    id: "t2",
    eventName: "Art Expo",
    eventDate: "2025-06-22",
    seat: "VIP",
    userId: "user-1",
    code: "TCKT-898721"
  },
  {
    id: "t3",
    eventName: "Food Carnival",
    eventDate: "2025-08-09",
    seat: "C10",
    userId: "user-2",
    code: "TCKT-55124"
  },
];

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
    // Filter the mock tickets for the user
    setTickets(TICKETS.filter(t => t.userId === userId));
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
