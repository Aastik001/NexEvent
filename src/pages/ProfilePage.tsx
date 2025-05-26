import { useEffect, useState } from "react";
import ProfileForm from "@/components/ProfileForm";
import TicketList from "@/components/TicketList";
import { supabase } from "@/lib/supabaseClient";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user info once on mount
    const fetchUser = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center">
        <User className="w-12 h-12 text-event-purple mb-3"/>
        <p className="text-lg font-bold mb-2">Not logged in</p>
        <a href="/login" className="text-event-purple underline">Go to Login</a>
      </div>
    );
  }

  // Extract metadata
  const { first_name, last_name, mobile } = user.user_metadata || {};

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <User className="h-6 w-6 text-event-purple"/>
          <span className="font-bold text-xl text-event-dark">Profile</span>
        </div>
        <Button variant="ghost" onClick={handleLogout}>
          <LogOut className="h-5 w-5 mr-1"/>
          Logout
        </Button>
      </div>
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-2">Personal Info</h2>
        <ProfileForm
          user={user}
          firstName={first_name}
          lastName={last_name}
          mobile={mobile}
        />
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-2">My Booked Tickets</h2>
        <TicketList userId={user.id} />
      </section>
    </div>
  );
};

export default ProfilePage;