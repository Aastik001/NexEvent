
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Event } from "@/types/event";
import { getEvents, updateEvent } from "@/utils/eventStorage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import CreateEventForm from "@/components/CreateEventForm";

const EditEventPage = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
    };
    fetchUser();

    if (id) {
      const userEvents = getEvents();
      const foundEvent = userEvents.find(e => e.id === id);
      if (foundEvent) {
        setEvent(foundEvent);
      } else {
        navigate('/');
        toast({
          title: "Event not found",
          variant: "destructive",
        });
      }
    }
  }, [id, navigate, toast]);

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

  const handleSubmit = (updatedEventData: Partial<Event>) => {
    if (!id) return;
    
    const updated = updateEvent(id, updatedEventData);
    if (updated) {
      toast({
        title: "Event updated",
        description: "Your event has been successfully updated.",
      });
      navigate(`/event/${id}`);
    } else {
      toast({
        title: "Error",
        description: "Could not update the event.",
        variant: "destructive",
      });
    }
  };

  if (!event) return null;

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
      <CreateEventForm initialData={event} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditEventPage;
