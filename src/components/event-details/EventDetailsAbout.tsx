
import { Event } from "@/types/event";

interface Props {
  event: Event;
}

const EventDetailsAbout = ({ event }: Props) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-4">About this event</h2>
    <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
  </div>
);

export default EventDetailsAbout;
