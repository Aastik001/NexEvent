import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { format } from "date-fns";

interface Ticket {
  id: string;
  ticket_number: string;
  quantity: number;
  event: {
    title: string;
    date: string;
  };
}

interface Props {
  userId: string;
}

const TicketList = ({ userId }: Props) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data, error } = await supabase
          .from('tickets')
          .select(`
            id,
            ticket_number,
            quantity,
            event:events (
              title,
              date
            )
          `)
          .eq('user_id', userId);
    
        if (error) throw error;
    
        // Transform the data to match the Ticket interface
        const transformedData = (data || []).map((ticket: any) => ({
          id: ticket.id,
          ticket_number: ticket.ticket_number,
          quantity: ticket.quantity || 1, // Add default value of 1
          event: {
            title: ticket.event.title || '',
            date: ticket.event.date || '',
          }
        }));
    
        setTickets(transformedData);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('tickets-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'tickets',
          filter: `user_id=eq.${userId}`
        }, 
        () => {
          fetchTickets();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId]);

  if (loading) {
    return <p>Loading tickets...</p>;
  }

  if (tickets.length === 0) {
    return <p className="my-6 text-muted-foreground">No tickets booked yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Ticket Number</TableHead>
          <TableHead>Quantity</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map(ticket => (
          <TableRow key={ticket.id}>
            <TableCell>{ticket.event.title}</TableCell>
            <TableCell>{format(new Date(ticket.event.date), 'MMM dd, yyyy')}</TableCell>
            <TableCell className="font-mono">{ticket.ticket_number}</TableCell>
            <TableCell>{ticket.quantity}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TicketList;