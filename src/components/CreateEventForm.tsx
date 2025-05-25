
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock } from "lucide-react";
import { useEffect } from "react";
import { Event } from "@/types/event";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  date: z.string().min(1, {
    message: "Please select a date.",
  }),
  time: z.string().min(1, {
    message: "Please select a time.",
  }),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters.",
  }),
  organizer: z.string().min(2, {
    message: "Organizer name must be at least 2 characters.",
  }),
  category: z.enum(["business", "social", "education", "other"]),
  imageUrl: z.string().optional(),
  admissionFree: z.boolean().default(false),
  price: z
    .union([
      z.string().transform(val => val === "" ? 0 : parseFloat(val)).refine(val => val >= 0, { message: "Price must be 0 or more." }),
      z.number().refine(val => val >= 0, { message: "Price must be 0 or more." })
    ])
    .default(0),
});

type FormData = z.infer<typeof formSchema>;

interface CreateEventFormProps {
  initialData?: Event;
  onSubmit: (data: FormData) => void;
}

const CreateEventForm = ({ initialData, onSubmit }: CreateEventFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      date: initialData?.date || "",
      time: initialData?.time || "",
      location: initialData?.location || "",
      organizer: initialData?.organizer || "",
      category: (initialData?.category as "business" | "social" | "education" | "other") || "social",
      imageUrl: initialData?.image_url || "",
      admissionFree: initialData?.price === 0 || initialData?.price === undefined,
      price: initialData?.price || 0,
    },
  });

  // Watch for changes to admissionFree toggle
  const admissionFree = form.watch("admissionFree");

  // Update the price when admissionFree changes
  useEffect(() => {
    if (admissionFree) {
      form.setValue("price", 0);
    }
  }, [admissionFree, form]);

  // Handle form submission
  const handleSubmit = (values: FormData) => {
    onSubmit({
      ...values,
      price: values.admissionFree ? 0 : values.price,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter event title" {...field} />
              </FormControl>
              <FormDescription>
                Choose a catchy title for your event.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your event"
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide details about your event.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="date"
                      className="pl-9"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="time"
                      className="pl-9"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter event location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="organizer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organizer</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter organizer name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter image URL for your event"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Add a cover image URL for your event.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <FormField
            control={form.control}
            name="admissionFree"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2 pt-2">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={checked => field.onChange(Boolean(checked))}
                    id="admission-free"
                  />
                </FormControl>
                <FormLabel htmlFor="admission-free" className="mb-0">
                  Admission is Free
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {admissionFree ? "Event Price (disabled)" : "Event Price"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    {...field}
                    value={admissionFree ? "" : field.value ?? ""}
                    disabled={admissionFree}
                  />
                </FormControl>
                <FormDescription>
                  Set the price for admission (leave at 0 for free events).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button type="submit" className="bg-event-purple hover:bg-purple-700">
            {initialData ? "Update Event" : "Create Event"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateEventForm;
