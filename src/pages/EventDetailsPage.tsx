import { useParams, useNavigate } from "react-router-dom";
import { mockEvents } from "../data/mockEvents";
import { useState, useEffect } from "react";
import { Event } from "@/types/event";
import { getEvents } from "@/utils/eventStorage";
import { useToast } from "@/hooks/use-toast";
import EventDetailsMain from "@/components/event-details/EventDetailsMain";
import EventNotFound from "@/components/event-details/EventNotFound";
import { isTicketFree, getTicketPrice } from "@/components/event-details/eventDetailsHelpers";

const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | undefined>(undefined);
  const [hasTicket, setHasTicket] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
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

  if (!event) {
    return <EventNotFound />;
  }

  const handleBookTicket = () => {
    if (hasTicket) {
      // Allow cancelling only for free events
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
      // No cancel for paid events
      return;
    }
    // Free event: Confirm ticket instantly
    if (isTicketFree(event)) {
      setEvent({
        ...event,
        attendees: [...event.attendees, "currentUser"],
      });
      setHasTicket(true);
      toast({
        title: "Ticket Confirmed!",
        description: "Your ticket for the event is confirmed.",
        variant: "default",
      });
    } else {
      // Paid event: Redirect to payment page with event ID + price
      navigate(`/payment?eventId=${event.id}&price=${getTicketPrice(event)}`);
    }
  };

  const showAsPaid = !isTicketFree(event);
  const ticketConfirmed = hasTicket && isTicketFree(event);

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
