
import { Calendar, Clock, MapPin, Users, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/event";
import { displayDate, isTicketFree, getTicketPrice } from "./eventDetailsHelpers";

interface Props {
  event: Event;
  hasTicket: boolean;
  ticketConfirmed: boolean;
  showAsPaid: boolean;
  onBookTicket: () => void;
}

const EventDetailsSidebar = ({
  event,
  hasTicket,
  ticketConfirmed,
  showAsPaid,
  onBookTicket
}: Props) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-24">
    <div className="mb-6">
      <h3 className="font-semibold text-lg mb-2">Event Details</h3>
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="h-4 w-4 text-event-purple" />
        <span className="text-gray-700">{displayDate(event.date)}</span>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-4 w-4 text-event-purple" />
        <span className="text-gray-700">{event.time}</span>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="h-4 w-4 text-event-purple" />
        <span className="text-gray-700">{event.location}</span>
      </div>
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-event-purple" />
        <span className="text-gray-700">
          {event.attendees.length} people are attending
        </span>
      </div>
    </div>
    <div className="flex flex-col gap-3">
      <Button
        size="lg"
        className={
          ticketConfirmed
            ? "bg-green-500 hover:bg-green-600"
            : showAsPaid
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-event-purple hover:bg-purple-700"
        }
        onClick={onBookTicket}
        disabled={ticketConfirmed}
      >
        {ticketConfirmed
          ? "Ticket Confirmed"
          : showAsPaid
          ? hasTicket
            ? "Ticket Confirmed"
            : "Book Tickets"
          : hasTicket
          ? "Ticket Confirmed"
          : "Book Tickets"}
        {showAsPaid && !hasTicket && event.price ? (
          <span className="ml-2 font-normal text-sm">(${event.price})</span>
        ) : null}
      </Button>
      <Button variant="outline" size="lg">
        <Share className="h-4 w-4 mr-2" />
        Share Event
      </Button>
    </div>
  </div>
);

export default EventDetailsSidebar;
