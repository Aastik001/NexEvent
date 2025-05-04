import { CalendarDays, Plus, User, LogIn, UserPlus, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { supabase, formatUser, type SupabaseUser } from "@/lib/supabaseClient";

const Header = () => {
  const [user, setUser] = useState<null | SupabaseUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user on mount
    const fetchUser = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getUser();
      setUser(formatUser(data?.user));
      setLoading(false);
    };
    fetchUser();

    // Listen to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        setUser(formatUser(session?.user));
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Logout action
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 sticky top-0 z-10">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-event-purple" />
          <span className="font-bold text-xl text-event-dark">NexEvent</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center sm:justify-end">
          <Link to="/">
            <Button variant="ghost" size="sm">Events</Button>
          </Link>
          <Link to="/create-event">
            <Button className="bg-event-purple hover:bg-purple-600 gap-2" size="sm">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
          {loading ? (
            <div className="h-10 w-20 bg-gray-100 animate-pulse rounded-md"></div>
          ) : user ? (
            <>
              <Link to="/profile">
                <Button variant="ghost" className="gap-2" size="sm" title="Profile">
                  <User className="h-5 w-5" />
                  Profile
                </Button>
              </Link>
              <Button variant="ghost" onClick={handleLogout} size="sm" title="Logout">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="gap-2" size="sm">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" className="gap-2" size="sm">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;