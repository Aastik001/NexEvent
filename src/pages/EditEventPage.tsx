
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Event } from "@/types/event";
import { updateEvent } from "@/utils/eventDb";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import CreateEventForm from "@/components/CreateEventForm";
import { useQuery } from "@tanstack/react-query";
import { mockEvents } from "@/data/mockEvents";

const EditEventPage = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      try {
        const { data } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();
        return data;
      } catch (error) {
        console.error("Error fetching event from database:", error);
        // Fallback to mock data if database fetch fails
        const mockEvent = mockEvents.find(event => event.id === id);
        if (mockEvent) return mockEvent;
        throw error;
      }
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (event && user && event.organizer !== user.email) {
      navigate('/');
      toast({
        title: "Unauthorized",
        description: "You can only edit your own events",
        variant: "destructive",
      });
    }
  }, [event, user, navigate, toast]);

  const handleSubmit = async (updatedEventData: Partial<Event>) => {
    if (!id) return;
    
    try {
      await updateEvent(id, updatedEventData);
      toast({
        title: "Event updated",
        description: "Your event has been successfully updated.",
      });
      navigate(`/event/${id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update the event. Using local demo mode.",
        variant: "destructive",
      });
      // For demo purposes, navigate back even if there was an error
      navigate(`/event/${id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="text-xl text-gray-500">Loading event details…</span>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
      <CreateEventForm initialData={event} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditEventPage;
