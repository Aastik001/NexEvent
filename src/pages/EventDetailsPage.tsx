import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import EventDetailsHeader from "@/components/event-details/EventDetailsHeader";
import EventDetailsAbout from "@/components/event-details/EventDetailsAbout";
import { Event } from "@/types/event";
import { Plus, Minus, Edit, Trash2 } from "lucide-react";
import { useStripe } from '@stripe/react-stripe-js';
import { createCheckoutSession } from '@/api/stripe';
import { deleteEvent } from '@/utils/eventDb';

const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [user, setUser] = useState<any>(null);
  const [hasTicket, setHasTicket] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const stripe = useStripe();
  const [isCreator, setIsCreator] = useState(false);

  // Combined fetch effect
  
  useEffect(() => {
    if (event && user) {
      setIsCreator(event.creator_id === user.id);
      console.log('Creator check:', { 
        eventCreatorId: event.creator_id, 
        userId: user.id, 
        isCreator: event.creator_id === user.id 
      });
    }
  }, [event, user]);
  
  const handleEditClick = () => {
    navigate(`/event/${id}/edit`);
  };

  const handleDeleteClick = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      if (!user?.id || !id) return;
      
      setLoading(true);
      await deleteEvent(id, user.id);
      
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete event",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    let mounted = true;

    const fetchEventAndTicket = async () => {
      
      if (!id) return;

      try {
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();

        if (eventError) throw eventError;
        if (!eventData) throw new Error("Event not found");

        if (mounted) {
          setEvent(eventData);
          if (user?.id) {
            setIsCreator(user?.id && eventData.creator_id === user.id);

            const { data: ticketData } = await supabase
              .from('tickets')
              .select('*')
              .eq('event_id', id)
              .eq('user_id', user.id)
              .single();

            setHasTicket(!!ticketData);
            if (ticketData) {
              setTicketQuantity(ticketData.quantity);
            }
          }
        }
      } catch (error: any) {
        console.error("Error loading event:", error);
        if (mounted) {
          toast({
            title: "Error",
            description: "Could not load event details",
            variant: "destructive",
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchEventAndTicket();

    return () => {
      mounted = false;
    };
  }, [id, user?.id, toast]);

  // Auth effect
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  
  
  
  const deleteEvent = async (eventId: string, userId: string): Promise<void> => {
    try {
      // First verify the creator
      const { data: existingEvent } = await supabase
        .from('events')
        .select('creator_id')
        .eq('id', eventId)
        .single();
  
      if (!existingEvent || existingEvent.creator_id !== userId) {
        throw new Error('Unauthorized: You can only delete your own events');
      }
  
      // Delete related tickets first (if you have a tickets table)
      await supabase
        .from('tickets')
        .delete()
        .eq('event_id', eventId);
  
      // Then delete the event
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);
  
      if (error) throw error;
    } catch (error: any) {
      console.error('Failed to delete event:', error);
      throw new Error(error.message || 'Failed to delete event');
    }
  };

  const handleBookTicket = async () => {
    if (!user || !event || !id) return;

    setIsBooking(true);
    try {
      if (hasTicket) {
        await supabase
          .from('tickets')
          .delete()
          .eq('event_id', id)
          .eq('user_id', user.id);
        
        setHasTicket(false);
        setTicketQuantity(1);
        toast({
          title: "Success!",
          description: "Your ticket has been cancelled.",
        });
      } else {
        if (event.price === 0) {
          const ticketNumber = `TCKT-${Math.floor(Math.random() * 900000) + 100000}`;
          await supabase
            .from('tickets')
            .insert({
              event_id: id,
              user_id: user.id,
              ticket_number: ticketNumber,
              quantity: ticketQuantity
            });
          
          setHasTicket(true);
          toast({
            title: "Success!",
            description: "Your free ticket has been booked.",
          });
        } else {
          if (!stripe) {
            throw new Error('Stripe not initialized');
          }

          const { id: sessionId } = await createCheckoutSession(id, ticketQuantity, user.id);
          
          const result = await stripe.redirectToCheckout({
            sessionId
          });

          if (result.error) {
            throw new Error(result.error.message);
          }
        }
      }
    } catch (error: any) {
      console.error("Booking error:", error);
      toast({
        title: "Error",
        description: error.message || "Could not process your request",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-event-purple"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p className="text-center text-gray-600">Event not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <EventDetailsHeader 
        event={event} 
        isCreator={isCreator} 
        onDelete={handleDeleteClick}
      />
      <EventDetailsAbout event={event} />
      
      <div className="mt-8">
        {user ? (
          <div className="space-y-4">
            {!hasTicket && !isCreator && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                    disabled={ticketQuantity <= 1 || isBooking}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{ticketQuantity}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTicketQuantity(ticketQuantity + 1)}
                    disabled={isBooking}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            {!isCreator && (
              <Button 
                onClick={handleBookTicket}
                disabled={isBooking}
                className="w-full sm:w-auto"
              >
                {isBooking ? "Processing..." : 
                 hasTicket ? 'Cancel Ticket' : 
                 `Book ${ticketQuantity} Ticket${ticketQuantity > 1 ? 's' : ''}`}
              </Button>
            )}
          </div>
        ) : (
          <Button
            onClick={() => navigate('/login', { 
              state: { returnTo: window.location.pathname } 
            })}
            className="w-full sm:w-auto"
          >
            Login to Book Tickets
          </Button>
        )}
      </div>
    </div>
  );
};

export default EventDetailsPage;