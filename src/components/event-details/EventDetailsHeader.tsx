
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Event } from "@/types/event";
import { displayDate } from "./eventDetailsHelpers";

interface Props {
  event: Event;
}

const EventDetailsHeader = ({ event }: Props) => (
  <>
    <div className="mb-8">
      <Link to="/" className="text-event-purple hover:text-purple-700 mb-4 inline-flex items-center gap-2">
        ← Back to Events
      </Link>
    </div>
    <div className="lg:col-span-2">
      {event.imageUrl && (
        <div className="rounded-xl overflow-hidden mb-6 h-64 md:h-96">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        {event.title}
      </h1>
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-sm">
          <Calendar className="h-4 w-4 text-event-purple" />
          <span>{displayDate(event.date)}</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-sm">
          <Clock className="h-4 w-4 text-event-purple" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-sm">
          <MapPin className="h-4 w-4 text-event-purple" />
          <span>{event.location}</span>
        </div>
      </div>
    </div>
  </>
);

export default EventDetailsHeader;
