import { Link, useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Wallet, Pencil, Trash2 } from "lucide-react";
import { Event } from "@/types/event";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface EventDetailsHeaderProps {
  event: Event;
  isCreator: boolean;
  onDelete: () => Promise<void>;
}

const EventDetailsHeader = ({ event, isCreator, onDelete }: EventDetailsHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="text-event-purple hover:text-purple-700">
          ← Back to Events
        </Link>
        {isCreator && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/event/${event.id}/edit`)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="border-t pt-6">
        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
        <div className="flex gap-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-5 w-5" />
            <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-5 w-5" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-5 w-5" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Wallet className="h-5 w-5" />
            <span>{event.price === 0 ? 'Free' : `$${event.price.toFixed(2)}`}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-8 mt-6">
        <div className="flex-1">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">About this event</h2>
              <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                {event.description}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Event Details</h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Organizer:</span>
                  <span className="ml-2 text-gray-600">{event.organizer}</span>
                </div>
                <div>
                  <span className="font-medium">Category:</span>
                  <Badge variant="secondary" className="ml-2">
                    {event.category}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/2">
          <div className="overflow-hidden rounded-lg">
            <img 
              src={event.image_url} 
              alt={event.title} 
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsHeader;