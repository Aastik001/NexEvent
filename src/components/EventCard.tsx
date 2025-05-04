
import { Calendar, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Event } from "../types/event";
import { Badge } from "./ui/badge";
import { format, parse } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

interface EventCardProps {
  event: Event;
}

const categoryColors: Record<string, string> = {
  business: "bg-event-soft-blue",
  social: "bg-event-soft-pink",
  education: "bg-event-soft-green",
  other: "bg-event-soft-yellow",
};

const EventCard = ({ event }: EventCardProps) => {
  return (
    <Card className="flex flex-col h-full">
      {/* Image section */}
      <div className="relative h-40 sm:h-48 overflow-hidden rounded-t-lg">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No Image Available</p>
          </div>
        )}
      </div>

      <CardHeader>
        <h3 className="text-xl font-semibold">{event.title}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(event.date), 'MMM dd, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{event.location}</span>
        </div>
        <div className="mt-2 text-lg font-semibold text-event-purple">
          {event.price === 0 ? 'Free' : formatPrice(event.price)}
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-gray-600 line-clamp-2">{event.description}</p>
      </CardContent>

      <CardFooter className="mt-auto">
      <Link 
  to={`/event/${event.id}`}  // Changed from /events/${event.id}
  className="text-event-purple hover:text-purple-700"
>
  View Details →
</Link>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
