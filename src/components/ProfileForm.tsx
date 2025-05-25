
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase, type SupabaseUser } from "@/lib/supabaseClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
  user: SupabaseUser;
}

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type EmailForm = z.infer<typeof emailSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

const ProfileForm = ({ user }: Props) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: user.email,
    },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const updateEmail = async (data: EmailForm) => {
    if (data.email === user.email) {
      toast({
        title: "No changes made",
        description: "Please update your email address before saving.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        email: data.email,
      });

      if (error) throw error;

      toast({
        title: "Email update initiated",
        description: "Please check your new email for a confirmation link to complete the update.",
      });
    } catch (error: any) {
      toast({
        title: "Email update failed",
        description: error.message || "Something went wrong, please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (data: PasswordForm) => {
    setLoading(true);

    try {
      // First verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: data.currentPassword,
      });

      if (signInError) {
        toast({
          title: "Current password is incorrect",
          description: "Please enter your current password correctly.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // If sign in was successful, update the password
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });

      // Reset the password form
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast({
        title: "Password update failed",
        description: error.message || "Something went wrong, please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs defaultValue="email" className="max-w-lg">
      <TabsList className="mb-4">
        <TabsTrigger value="email">Update Email</TabsTrigger>
        <TabsTrigger value="password">Update Password</TabsTrigger>
      </TabsList>
      
      <TabsContent value="email">
        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(updateEmail)} className="space-y-4">
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="bg-event-purple" disabled={loading}>
              {loading ? "Updating..." : "Update Email"}
            </Button>
          </form>
        </Form>
      </TabsContent>
      
      <TabsContent value="password">
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(updatePassword)} className="space-y-4">
            <FormField
              control={passwordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="bg-event-purple" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileForm;
