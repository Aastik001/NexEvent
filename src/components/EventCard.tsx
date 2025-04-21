
import { Calendar, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Event } from "../types/event";
import { Badge } from "./ui/badge";
import { format, parse } from "date-fns";

interface EventCardProps {
  event: Event;
}

const categoryColors: Record<string, string> = {
  business: "bg-event-soft-blue",
  social: "bg-event-soft-pink",
  education: "bg-event-soft-green",
  other: "bg-event-soft-yellow",
};

export const EventCard = ({ event }: EventCardProps) => {
  // Format the date for display
  const displayDate = () => {
    try {
      const parsedDate = parse(event.date, "yyyy-MM-dd", new Date());
      return format(parsedDate, "MMM d, yyyy");
    } catch {
      return event.date;
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full">
      {event.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-3 flex justify-between items-start">
          <Badge className={`${categoryColors[event.category]} text-gray-700`}>
            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
          </Badge>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{event.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">{event.description}</p>
        <div className="flex flex-col gap-2 text-sm text-gray-500 mt-auto">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-event-purple" />
            <span>{displayDate()} • {event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-event-purple" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-event-purple" />
            <span>{event.attendees.length} attending</span>
          </div>
        </div>
        <Link 
          to={`/event/${event.id}`} 
          className="mt-4 text-event-purple font-medium hover:text-purple-700 inline-flex items-center"
        >
          View details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
