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
import { Stethoscope, User, Weight, Ruler, Droplet } from 'lucide-react'; // Added relevant icons

// Define Zod schema for form validation
const formSchema = z.object({
  age: z.coerce.number().min(1, { message: "Age must be at least 1." }).max(120, { message: "Age seems unrealistic." }),
  bloodGroup: z.string().min(1, { message: "Blood group is required." }),
  gender: z.enum(['Male', 'Female', 'Other'], { required_error: "Gender is required." }),
  weight: z.coerce.number().min(1, { message: "Weight must be positive." }),
  height: z.coerce.number().min(1, { message: "Height must be positive." }),
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
      age: '', // Initialize with empty string
      bloodGroup: "",
      gender: undefined,
      weight: '', // Initialize with empty string
      height: '', // Initialize with empty string
    },
  });

  return (
    <Card className="w-full max-w-md shadow-lg bg-card border border-border rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Stethoscope className="text-primary" /> Patient Information
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter the details below to predict diabetes risk.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><User size={16} /> Age (Years)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 45" {...field} className="bg-background" />
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
                  <FormLabel className="flex items-center gap-2"><Droplet size={16} /> Blood Group</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background">
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
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background">
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
                  <FormLabel className="flex items-center gap-2"><Weight size={16} /> Weight (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 70" {...field} step="0.1" className="bg-background" />
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
                  <FormLabel className="flex items-center gap-2"><Ruler size={16} /> Height (cm)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 175" {...field} step="0.1" className="bg-background" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-md">
              {isLoading ? 'Predicting...' : 'Predict Diabetes Risk'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
