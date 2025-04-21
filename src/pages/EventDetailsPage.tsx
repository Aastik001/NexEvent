
import { useParams, useNavigate } from "react-router-dom";
import { mockEvents } from "../data/mockEvents";
import { useState, useEffect } from "react";
import type { Event } from "@/types/event";
import { getEvents } from "@/utils/eventStorage";
import { useToast } from "@/hooks/use-toast";
import EventDetailsMain from "@/components/event-details/EventDetailsMain";
import { isTicketFree, getTicketPrice } from "@/components/event-details/eventDetailsHelpers";
import { saveTicket } from "@/utils/ticketStorage";
import { supabase } from "@/lib/supabaseClient";

const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | undefined>(undefined);
  const [hasTicket, setHasTicket] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
    };
    fetchUser();

    let foundEvent = mockEvents.find((e) => e.id === id);

    if (!foundEvent) {
      const userEvents = getEvents();
      foundEvent = userEvents.find((e) => e.id === id);
    }

    if (foundEvent) {
      setEvent(foundEvent);
      setHasTicket(foundEvent.attendees.includes("currentUser"));
    } else {
      toast({
        title: "Event not found",
        description: "The event you're looking for couldn't be found.",
        variant: "destructive",
      });
    }
  }, [id, toast]);

  const handleBookTicket = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to book tickets.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!event) {
      toast({
        title: "Event not found",
        description: "Cannot book a ticket for an event that doesn't exist.",
        variant: "destructive",
      });
      return;
    }

    if (hasTicket) {
      if (isTicketFree(event)) {
        setEvent({
          ...event,
          attendees: event.attendees.filter((a) => a !== "currentUser"),
        });
        setHasTicket(false);
        toast({
          title: "Ticket cancelled",
          variant: "destructive",
        });
      }
      return;
    }

    if (isTicketFree(event)) {
      setEvent({
        ...event,
        attendees: [...event.attendees, "currentUser"],
      });
      
      saveTicket(user.id, event.title, event.date);
      window.dispatchEvent(new Event('ticketsUpdated'));
      
      setHasTicket(true);
      toast({
        title: "Ticket Confirmed!",
        description: "Your ticket for the event is confirmed.",
        variant: "default",
      });
    } else {
      navigate(`/payment?eventId=${event.id}&price=${getTicketPrice(event)}`);
    }
  };

  const showAsPaid = event ? !isTicketFree(event) : false;
  const ticketConfirmed = hasTicket && event ? isTicketFree(event) : false;

  return (
    <EventDetailsMain
      event={event}
      hasTicket={hasTicket}
      ticketConfirmed={ticketConfirmed}
      showAsPaid={showAsPaid}
      onBookTicket={handleBookTicket}
    />
  );
};

export default EventDetailsPage;
