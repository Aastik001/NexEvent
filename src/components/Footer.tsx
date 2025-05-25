
import { CalendarDays } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-8 px-4 mt-12 border-t border-gray-200">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-event-purple" />
            <span className="font-bold text-lg text-event-dark">NexEvent</span>
          </div>
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} NexEvent. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-gray-500 hover:text-event-purple">
              Terms
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-event-purple">
              Privacy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-event-purple">
              Help
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

