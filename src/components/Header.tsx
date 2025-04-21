
import { CalendarDays, Plus, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const Header = () => {
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
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
