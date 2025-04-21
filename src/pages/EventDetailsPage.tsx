
import { useParams, Link, useNavigate } from "react-router-dom";
import { mockEvents } from "../data/mockEvents";
import { useState, useEffect } from "react";
import { Event } from "@/types/event";
import { getEvents } from "@/utils/eventStorage";
import { useToast } from "@/hooks/use-toast";
import EventDetailsHeader from "@/components/event-details/EventDetailsHeader";
import EventDetailsAbout from "@/components/event-details/EventDetailsAbout";
import EventDetailsOrganizer from "@/components/event-details/EventDetailsOrganizer";
import EventDetailsSidebar from "@/components/event-details/EventDetailsSidebar";
import { isTicketFree, getTicketPrice } from "@/components/event-details/eventDetailsHelpers";

// Main event details page logic
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
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Event not found</h2>
        <p className="text-gray-600 mb-8">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/">
          <button className="bg-event-purple text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">Back to Events</button>
        </Link>
      </div>
    );
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
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <EventDetailsHeader event={event} />
          <EventDetailsAbout event={event} />
          <EventDetailsOrganizer organizer={event.organizer} />
        </div>
        <div className="lg:col-span-1">
          <EventDetailsSidebar
            event={event}
            hasTicket={hasTicket}
            ticketConfirmed={ticketConfirmed}
            showAsPaid={showAsPaid}
            onBookTicket={handleBookTicket}
          />
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
