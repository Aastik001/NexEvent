
import EventDetailsHeader from "./EventDetailsHeader";
import EventDetailsAbout from "./EventDetailsAbout";
import EventDetailsOrganizer from "./EventDetailsOrganizer";
import EventDetailsSidebar from "./EventDetailsSidebar";
import { Event } from "@/types/event";

interface Props {
  event: Event;
  hasTicket: boolean;
  ticketConfirmed: boolean;
  showAsPaid: boolean;
  onBookTicket: () => void;
}

const EventDetailsMain = ({
  event,
  hasTicket,
  ticketConfirmed,
  showAsPaid,
  onBookTicket,
}: Props) => (
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
          onBookTicket={onBookTicket}
        />
      </div>
    </div>
  </div>
);

export default EventDetailsMain;
