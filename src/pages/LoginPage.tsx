import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const returnTo = (location.state as any)?.returnTo || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login successful!",
        });
        // Redirect to the return URL instead of root
        window.location.href = returnTo;
      }
    } catch (error: any) {
      // ...existing error handling...
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white shadow px-8 py-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-event-dark">
          <LogIn className="h-6 w-6" />
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm" htmlFor="login-email">
              Email
            </label>
            <Input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm" htmlFor="login-password">
              Password
            </label>
            <Input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
            />
            <div className="mt-2 text-right">
              <Link to="/forgot-password" className="text-sm text-event-purple underline hover:opacity-80">
                Forgot password?
              </Link>
            </div>
          </div>
          <Button type="submit" className="w-full bg-event-purple hover:bg-purple-700" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-event-purple underline hover:opacity-80">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;