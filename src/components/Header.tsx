import { CalendarDays, Plus, User, LogIn, UserPlus, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
// @ts-expect-error: Supabase client is injected by Lovable/Supabase integration
import { supabase } from "@/lib/supabaseClient";

const Header = () => {
  const [user, setUser] = useState<null | { email: string }>(null);

  useEffect(() => {
    // Get user on mount
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    };
    fetchUser();

    // Listen to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Logout action
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-event-purple" />
          <span className="font-bold text-xl text-event-dark">EventWave</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost">Events</Button>
          </Link>
          <Link to="/create-event">
            <Button className="bg-event-purple hover:bg-purple-600 gap-2">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="rounded-full" title={user.email}>
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" onClick={handleLogout} title="Logout">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" className="gap-2">
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
