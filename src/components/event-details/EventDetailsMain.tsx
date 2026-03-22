import { Button } from "@/components/ui/button";
import EventDetailsHeader from "@/components/event-details/EventDetailsHeader";
import { Event } from "@/types/event";

interface EventDetailsMainProps {
  event: Event | undefined;
  hasTicket: boolean;
  ticketConfirmed: boolean;
  showAsPaid: boolean;
  onBookTicket: () => Promise<void>;
}

const EventDetailsMain = ({
  event,
  hasTicket,
  ticketConfirmed,
  showAsPaid,
  onBookTicket,
}: EventDetailsMainProps) => {
  if (!event) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p>Loading event details...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {/* Use your original header component */}
      <EventDetailsHeader event={event} />

      {/* Price and Organizer Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Price Details</h2>
          <div className="flex items-center gap-2">
            <span className="font-medium">Ticket Price:</span>
            <span className={event.price === 0 ? "text-green-600" : "text-gray-800"}>
              {event.price === 0 ? 'Free' : `$${event.price.toFixed(2)}`}
            </span>
          </div>
          {showAsPaid && (
            <p className="mt-2 text-sm text-gray-600">
              {hasTicket 
                ? "You've already booked this event" 
                : "Payment required to attend"}
            </p>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Organizer</h2>
          <p className="text-gray-800">{event.organizer}</p>
          {/* Add contact button if needed */}
        </div>
      </div>

      {/* Event Description */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">About This Event</h2>
        <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
      </div>

      {/* Ticket Button */}
      <div className="mt-6">
        <Button
          onClick={onBookTicket}
          className="w-full md:w-auto"
          disabled={showAsPaid && hasTicket}
        >
          {showAsPaid
            ? hasTicket
              ? "Ticket Purchased"
              : "Buy Ticket ($" + event.price.toFixed(2) + ")"
            : hasTicket
            ? "Cancel Ticket"
            : "Get Ticket" + (event.price === 0 ? "" : " ($" + event.price.toFixed(2) + ")")}
        </Button>
        
        {ticketConfirmed && (
          <p className="mt-2 text-sm text-green-600">
            Your ticket has been confirmed!
          </p>
        )}
      </div>
    </div>
  );
};

export default EventDetailsMain;