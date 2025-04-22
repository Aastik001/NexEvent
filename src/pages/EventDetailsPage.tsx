
import { useParams, useNavigate } from "react-router-dom";
import { mockEvents } from "../data/mockEvents";
import { useState, useEffect } from "react";
import type { Event } from "@/types/event";
import { useToast } from "@/hooks/use-toast";
import EventDetailsMain from "@/components/event-details/EventDetailsMain";
import { isTicketFree, getTicketPrice } from "@/components/event-details/eventDetailsHelpers";
import { saveTicket } from "@/utils/ticketStorage";
import { supabase } from "@/lib/supabaseClient";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { deleteEvent } from "@/utils/eventDb";

const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | undefined>(undefined);
  const [hasTicket, setHasTicket] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
    };
    fetchUser();

    const fetchEvent = async () => {
      if (!id) return;

      try {
        // Try to fetch from Supabase
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          setEvent(data);
          setHasTicket(data.attendees.includes(user?.id || "currentUser"));
          return;
        }

        // If not found in Supabase, check mock events
        let foundEvent = mockEvents.find((e) => e.id === id);

        if (foundEvent) {
          setEvent(foundEvent);
          setHasTicket(foundEvent.attendees.includes(user?.id || "currentUser"));
        } else {
          toast({
            title: "Event not found",
            description: "The event you're looking for couldn't be found.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        
        // Try mock events as fallback
        let foundEvent = mockEvents.find((e) => e.id === id);
        
        if (foundEvent) {
          setEvent(foundEvent);
          setHasTicket(foundEvent.attendees.includes(user?.id || "currentUser"));
        } else {
          toast({
            title: "Error loading event",
            description: "There was a problem loading the event details.",
            variant: "destructive",
          });
        }
      }
    };

    fetchEvent();
  }, [id, toast, user]);

  const handleBookTicket = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to book tickets.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!event) {
      toast({
        title: "Event not found",
        description: "Cannot book a ticket for an event that doesn't exist.",
        variant: "destructive",
      });
      return;
    }

    if (hasTicket) {
      if (isTicketFree(event)) {
        setEvent({
          ...event,
          attendees: event.attendees.filter((a) => a !== "currentUser"),
        });
        setHasTicket(false);
        toast({
          title: "Ticket cancelled",
          variant: "destructive",
        });
      }
      return;
    }

    if (isTicketFree(event)) {
      setEvent({
        ...event,
        attendees: [...event.attendees, "currentUser"],
      });
      
      saveTicket(user.id, event.title, event.date);
      window.dispatchEvent(new Event('ticketsUpdated'));
      
      setHasTicket(true);
      toast({
        title: "Ticket Confirmed!",
        description: "Your ticket for the event is confirmed.",
        variant: "default",
      });
    } else {
      navigate(`/payment?eventId=${event.id}&price=${getTicketPrice(event)}`);
    }
  };

  const handleDeleteEvent = async () => {
    if (!event?.id) return;
    
    try {
      await deleteEvent(event.id);
      toast({
        title: "Event deleted",
        description: "The event has been successfully deleted.",
      });
      navigate('/');
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Could not delete the event.",
        variant: "destructive",
      });
    }
  };

  const handleEditEvent = () => {
    navigate(`/edit-event/${event?.id}`);
  };

  const isEventCreator = user?.email === event?.organizer;
  const showAsPaid = event ? !isTicketFree(event) : false;
  const ticketConfirmed = hasTicket && event ? isTicketFree(event) : false;

  return (
    <div>
      {isEventCreator && (
        <div className="container max-w-2xl mx-auto pt-4 px-4 flex justify-end gap-2">
          <Button variant="outline" onClick={handleEditEvent}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Event
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Event
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the event.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteEvent}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
      <EventDetailsMain
        event={event}
        hasTicket={hasTicket}
        ticketConfirmed={ticketConfirmed}
        showAsPaid={showAsPaid}
        onBookTicket={handleBookTicket}
      />
    </div>
  );
};

export default EventDetailsPage;
