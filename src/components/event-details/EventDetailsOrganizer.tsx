
import { User } from "lucide-react";
import { Event } from "@/types/event";

interface Props {
  organizer: string;
}

const EventDetailsOrganizer = ({ organizer }: Props) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-4">Organized by</h2>
    <div className="flex items-center gap-3">
      <div className="bg-gray-100 rounded-full p-3">
        <User className="h-6 w-6 text-gray-700" />
      </div>
      <div>
        <p className="font-medium">{organizer}</p>
        <p className="text-sm text-gray-500">Event Organizer</p>
      </div>
    </div>
  </div>
);

export default EventDetailsOrganizer;
