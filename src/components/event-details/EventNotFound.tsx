
import { Link } from "react-router-dom";

const EventNotFound = () => (
  <div className="container mx-auto py-16 px-4 text-center">
    <h2 className="text-2xl font-bold mb-4">Event not found</h2>
    <p className="text-gray-600 mb-8">
      The event you're looking for doesn't exist or has been removed.
    </p>
    <Link to="/">
      <button className="bg-event-purple text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
        Back to Events
      </button>
    </Link>
  </div>
);

export default EventNotFound;
