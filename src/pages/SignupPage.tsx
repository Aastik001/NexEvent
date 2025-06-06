import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const SignupPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Sign up with Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            first_name: firstName,
            last_name: lastName,
            mobile,
          },
        },
      });

      setLoading(false);

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Check if user was created
        if (data && data.user) {
          toast({
            title: "Sign up successful!",
            description: "Please check your email to confirm your account before logging in.",
          });
          navigate("/login");
        } else {
          toast({
            title: "Email verification required",
            description: "A confirmation link has been sent to your email address. Please confirm your email before logging in.",
          });
          navigate("/login");
        }
      }
    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Unexpected error",
        description: error.message || "Something went wrong during sign up.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white shadow px-8 py-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-event-dark">
          <UserPlus className="h-6 w-6" />
          Sign Up
        </h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm" htmlFor="signup-firstname">
                First Name
              </label>
              <Input
                id="signup-firstname"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
                placeholder="First name"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm" htmlFor="signup-lastname">
                Last Name
              </label>
              <Input
                id="signup-lastname"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
                placeholder="Last name"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 text-sm" htmlFor="signup-mobile">
              Mobile Number
            </label>
            <Input
              id="signup-mobile"
              type="tel"
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              autoComplete="tel"
              placeholder="Mobile number"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm" htmlFor="signup-email">
              Email
            </label>
            <Input
              id="signup-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm" htmlFor="signup-password">
              Password
            </label>
            <Input
              id="signup-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="At least 6 characters"
              minLength={6}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm" htmlFor="signup-confirm-password">
              Confirm Password
            </label>
            <Input
              id="signup-confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full bg-event-purple hover:bg-purple-700" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-event-purple underline hover:opacity-80">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;