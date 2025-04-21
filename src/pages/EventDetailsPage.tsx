
import { useParams, Link } from "react-router-dom";
import { mockEvents } from "../data/mockEvents";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Share2, User, Users } from "lucide-react";
import { format, parse } from "date-fns";
import { useState } from "react";
import { Event } from "@/types/event";

const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | undefined>(
    mockEvents.find((e) => e.id === id)
  );
  const [isAttending, setIsAttending] = useState(false);

  if (!event) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Event not found</h2>
        <p className="text-gray-600 mb-8">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/">
          <Button>Back to Events</Button>
        </Link>
      </div>
    );
  }

  const handleRSVP = () => {
    if (isAttending) {
      // Remove from attendees
      setEvent({
        ...event,
        attendees: event.attendees.filter((a) => a !== "currentUser"),
      });
    } else {
      // Add to attendees
      setEvent({
        ...event,
        attendees: [...event.attendees, "currentUser"],
      });
    }
    setIsAttending(!isAttending);
  };

  // Format the date for display
  const displayDate = () => {
    try {
      const parsedDate = parse(event.date, "yyyy-MM-dd", new Date());
      return format(parsedDate, "EEEE, MMMM d, yyyy");
    } catch {
      return event.date;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Link to="/" className="text-event-purple hover:text-purple-700 mb-4 inline-flex items-center gap-2">
          ← Back to Events
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
              <span>{displayDate()}</span>
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

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">About this event</h2>
            <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Organized by</h2>
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 rounded-full p-3">
                <User className="h-6 w-6 text-gray-700" />
              </div>
              <div>
                <p className="font-medium">{event.organizer}</p>
                <p className="text-sm text-gray-500">Event Organizer</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-24">
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Event Details</h3>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-event-purple" />
                <span className="text-gray-700">{displayDate()}</span>
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
                  isAttending
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-event-purple hover:bg-purple-700"
                }
                onClick={handleRSVP}
              >
                {isAttending ? "Cancel RSVP" : "RSVP to Event"}
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-4 w-4 mr-2" />
                Share Event
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
