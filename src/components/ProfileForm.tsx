
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

interface Props {
  user: { email: string };
}

const ProfileForm = ({ user }: Props) => {
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate update (replace with real update in production)
    // Mock updating only if email changed for demo/local
    if (email !== user.email) {
      // Here, with Supabase, you'd call supabase.auth.updateUser({ email })
      // We'll just mock success quickly.
      setTimeout(() => {
        setLoading(false);
        toast({
          title: "Profile updated",
          description: "Your email was updated successfully.",
        });
      }, 800);
    } else {
      setLoading(false);
      toast({
        title: "No changes made",
        description: "Please update your email address before saving.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block mb-1 text-sm" htmlFor="profile-email">
          Email
        </label>
        <Input
          id="profile-email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="bg-event-purple" disabled={loading}>
        {loading ? "Saving..." : "Update Profile"}
      </Button>
    </form>
  );
};

export default ProfileForm;
