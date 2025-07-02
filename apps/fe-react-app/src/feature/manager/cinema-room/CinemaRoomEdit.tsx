import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/Shadcn/ui/form";
import { Input } from "@/components/Shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import type { CinemaRoom } from "@/interfaces/cinemarooms.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  roomNumber: z.number().min(100, "Room number must be at least 100").max(999, "Room number must be at most 999"),
  type: z.string().min(1, "Type is required"),
  fee: z.number().min(10000, "Fee must be at least 10,000"),
  capacity: z.number().min(20, "Capacity must be at least 20 seats"),
  status: z.enum(["ACTIVE", "MAINTENANCE", "CLOSED"]),
  width: z.number().min(5, "Width must be at least 5").max(20, "Width must be at most 20"),
  length: z.number().min(5, "Length must be at least 5").max(20, "Length must be at most 20"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CinemaRoomEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomNumber: 100,
      type: "Standard",
      fee: 50000,
      capacity: 100,
      status: "ACTIVE",
      width: 10,
      length: 10,
    },
  });

  // Fetch cinema room data
  useEffect(() => {
    const fetchCinemaRoom = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/cinema-rooms/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CinemaRoom = await response.json();

        // Update form values
        form.reset({
          roomNumber: data.id, // Use id as roomNumber
          type: data.type,
          fee: data.fee,
          capacity: data.capacity,
          status: data.status as "ACTIVE" | "MAINTENANCE" | "CLOSED",
          width: data.width,
          length: data.length,
        });

        setError(null);
      } catch (error) {
        console.error("Error fetching cinema room:", error);
        setError("Failed to load cinema room data");
        toast.error("Failed to load cinema room data");
      } finally {
        setLoading(false);
      }
    };

    fetchCinemaRoom();
  }, [id, form]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const onSubmit = async (values: FormValues) => {
    if (!id) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`http://localhost:3000/cinema-rooms/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success("Cinema room updated successfully");
      navigate("/admin/cinema-room");
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error("Failed to update cinema room");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">Loading cinema room data...</CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="p-8 text-center text-red-500">{error}</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center">
          <Button variant="outline" size="icon" onClick={handleGoBack} className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Edit Cinema Room</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="roomNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Number*</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Room number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select room type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Standard">Standard</SelectItem>
                          <SelectItem value="VIP">VIP</SelectItem>
                          <SelectItem value="Premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fee (VND)*</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Fee" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity*</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Capacity" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                          <SelectItem value="CLOSED">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Width*</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Width" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Length*</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Length" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <CardFooter className="flex justify-end space-x-2 px-0">
                <Button variant="outline" type="button" onClick={handleGoBack}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Cinema Room"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
