import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { saveEvent } from "@/utils/eventDb";
import CreateEventForm from "@/components/CreateEventForm";
import { Event } from "@/types/event";
import { EventInput } from "@/types/event"; // <-- import EventInput separately

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [user, setUser] = useState<any>(null); // you could also type this better later
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      setIsLoadingUser(true);
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setUser(data.user);
        } else {
          toast({
            title: "Authentication required",
            description: "You need to be logged in to create an event",
            variant: "destructive",
          });
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("Auth error:", error);
        toast({
          title: "Authentication error",
          description: "Please try logging in again",
          variant: "destructive",
        });
        navigate("/login", { replace: true });
      } finally {
        setIsLoadingUser(false);
      }
    };

    checkUser();
  }, [navigate, toast]);

  // 🔥 Updated handleSubmit now uses EventInput
  const handleSubmit = async (values: EventInput) => {
    try {
      if (!user?.id) {
        throw new Error("You must be logged in to create an event");
      }
  
      const eventData = {
        ...values,
        organizer: values.organizer,
      };
  
      const savedEvent = await saveEvent(eventData, user.id); // Pass user.id here
  
      if (savedEvent) {
        toast({
          title: "Event Created!",
          description: "Your event has been created successfully",
        });
        navigate("/");
      } else {
        throw new Error("Failed to save event");
      }
    } catch (error) {
      console.error("Error saving event:", error);
      toast({
        title: "Error Creating Event",
        description: "There was a problem creating your event.",
        variant: "destructive"
      });
    }
  };

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="text-xl text-gray-500">Checking authentication…</span>
      </div>
    );
  }

  if (!user) {
    return null; // User will be redirected automatically
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Create New Event</h1>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
          {/* ✅ pass correct onSubmit */}
          <CreateEventForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;
