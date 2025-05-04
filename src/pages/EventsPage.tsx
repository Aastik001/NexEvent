import { useState } from "react";
import EventCard from "../components/EventCard";
import CategoryFilter from "../components/CategoryFilter";
import { Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getEvents } from "@/utils/eventDb";
import { Event } from "../types/event";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const EventsPage = () => {
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      // Fetch events (which will return mock events as fallback if DB fetch fails)
      const eventsData = await getEvents();
      
      
      
      return eventsData;
    },
    // This ensures the events list gets refreshed when we return to this page
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  const filteredEvents = events.filter(event => {
    const matchesCategory = !categoryFilter || event.category === categoryFilter;
    
    const matchesSearch = !searchQuery || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="text-xl text-gray-500">Loading events…</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-2 sm:px-4 md:px-8">
      <div className="mb-10">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Calendar className="h-8 w-8 text-event-purple" />
          <h1 className="text-3xl font-bold text-center text-gray-800">Upcoming Events</h1>
        </div>
        <p className="text-gray-600 text-center max-w-2xl mx-auto">
          Discover and join the best events happening near you. From tech conferences to social gatherings, find your next experience!
        </p>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
        <CategoryFilter onFilterChange={setCategoryFilter} />
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search events..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-medium text-gray-700">No events found</h3>
          <p className="text-gray-500 mt-2">Try changing your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
