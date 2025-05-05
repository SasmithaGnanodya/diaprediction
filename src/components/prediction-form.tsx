'use client';

import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, User, Weight, Ruler, Droplet, PersonStanding } from 'lucide-react'; // Added relevant icons, replaced Gender icon

// Define Zod schema for form validation
const formSchema = z.object({
  age: z.coerce.number().min(1, { message: "Age must be at least 1." }).max(120, { message: "Age seems unrealistic." }).int("Age must be a whole number."),
  bloodGroup: z.string().min(1, { message: "Blood group is required." }),
  gender: z.enum(['Male', 'Female', 'Other'], { required_error: "Gender is required." }),
  weight: z.coerce.number().min(1, { message: "Weight must be positive." }).max(500, { message: "Weight seems unrealistic."}),
  height: z.coerce.number().min(50, { message: "Height must be at least 50cm." }).max(250, { message: "Height seems unrealistic."}).int("Height must be a whole number (cm)."),
});

export type PredictionFormData = z.infer<typeof formSchema>;

interface PredictionFormProps {
  onSubmit: SubmitHandler<PredictionFormData>;
  isLoading: boolean;
}

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function PredictionForm({ onSubmit, isLoading }: PredictionFormProps) {
  const form = useForm<PredictionFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: undefined, // Use undefined for better placeholder behavior
      bloodGroup: "",
      gender: undefined,
      weight: undefined, // Use undefined
      height: undefined, // Use undefined
    },
  });

  return (
    <Card className="w-full max-w-md shadow-xl bg-card border border-border rounded-xl"> {/* Increased rounding and shadow */}
      <CardHeader className="pb-4"> {/* Reduced bottom padding */}
        <CardTitle className="text-2xl font-semibold text-foreground flex items-center gap-2"> {/* Adjusted font weight */}
          <Stethoscope className="text-primary w-6 h-6" /> Patient Information
        </CardTitle>
        <CardDescription className="text-muted-foreground pt-1">
          Enter the details below to predict diabetes risk.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-5 px-6 pt-2 pb-6"> {/* Adjusted padding and spacing */}
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 font-medium"><User size={16} /> Age</FormLabel>
                  <FormControl>
                    {/* Pass value as string or empty string to avoid controlled/uncontrolled warning */}
                    <Input type="number" placeholder="Years (e.g., 45)" {...field} value={field.value ?? ''} className="bg-background border-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bloodGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 font-medium"><Droplet size={16} /> Blood Group</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background border-input">
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bloodGroups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 font-medium"><PersonStanding size={16} /> Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background border-input">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 font-medium"><Weight size={16} /> Weight</FormLabel>
                  <FormControl>
                     {/* Pass value as string or empty string */}
                    <Input type="number" placeholder="Kilograms (e.g., 70)" {...field} value={field.value ?? ''} step="0.1" className="bg-background border-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 font-medium"><Ruler size={16} /> Height</FormLabel>
                  <FormControl>
                    {/* Pass value as string or empty string */}
                    <Input type="number" placeholder="Centimeters (e.g., 175)" {...field} value={field.value ?? ''} className="bg-background border-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="px-6 pb-6"> {/* Adjusted padding */}
            <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg text-base"> {/* Larger button, more rounded */}
              {isLoading ? 'Analyzing...' : 'Assess Diabetes Risk'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
