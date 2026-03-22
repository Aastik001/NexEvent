import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { Event } from '@/types/event';
import EventForm from '@/components/EventForm';
import { updateEvent } from '@/utils/eventDb';
const EditEventPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id || !user?.id) return;

      try {
        const { data: eventData, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!eventData) throw new Error('Event not found');

        // Check if the user is the creator
        if (eventData.creator_id !== user.id) {
          throw new Error('Unauthorized');
        }

        setEvent(eventData);
      } catch (error: any) {
        console.error('Error loading event:', error);
        toast({
          title: 'Error',
          description: error.message === 'Unauthorized' 
            ? 'You are not authorized to edit this event'
            : 'Could not load event details',
          variant: 'destructive',
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user?.id, navigate, toast]);

  const handleSubmit = async (updatedEventData: Partial<Event>) => {
    if (!id || !user) return;
    
    try {
      const updated = await updateEvent(id, updatedEventData, user.id);
      
      toast({
        title: "Event updated",
        description: "Your event has been successfully updated.",
      });
      navigate(`/event/${id}`);
    } catch (error: any) {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: error.message || "There was an issue updating your event.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-6 px-2">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-event-purple"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-5xl mx-auto py-6 px-2">
        <p className="text-center text-gray-600">Event not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-6 px-2">
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
      <EventForm 
        initialData={event}
        onSubmit={handleSubmit}
        submitLabel="Update Event"
      />
    </div>
  );
};

export default EditEventPage;