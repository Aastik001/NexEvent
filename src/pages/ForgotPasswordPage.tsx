import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setSent(true);
      toast({
        title: "Password reset email sent",
        description: "Check your inbox for a link to reset your password.",
      });
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white shadow px-8 py-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-event-dark">
          <Mail className="h-6 w-6" />
          Forgot Password
        </h2>
        {sent ? (
          <div className="text-center">
            <p className="mb-4">
              If an account exists for <span className="font-semibold">{email}</span>, you’ll receive an email with instructions to reset your password.
            </p>
            <Link to="/login" className="text-event-purple underline hover:opacity-80">
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm" htmlFor="forgot-email">
                Email
              </label>
              <Input
                id="forgot-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="your@email.com"
              />
            </div>
            <Button type="submit" className="w-full bg-event-purple hover:bg-purple-700" disabled={loading}>
              {loading ? "Sending..." : "Send reset link"}
            </Button>
            <div className="text-center mt-2">
              <Link to="/login" className="text-sm text-event-purple underline hover:opacity-80">
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;