
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import EventDetailsPage from "./pages/EventDetailsPage";
import CreateEventPage from "./pages/CreateEventPage";
import EditEventPage from "./pages/EditEventPage";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

const queryClient = new QueryClient();
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const App = () => (
  <QueryClientProvider client={queryClient}>
    <Elements stripe={stripePromise}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow bg-gray-50 px-2 sm:px-4 md:px-8">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/event/:id" element={<EventDetailsPage />} />
                <Route path="/create-event" element={<CreateEventPage />} />
                <Route path="/event/:id/edit" element={<EditEventPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </Elements>
  </QueryClientProvider>
);

export default App;
