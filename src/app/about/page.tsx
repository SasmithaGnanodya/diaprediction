'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <Card className="w-full max-w-lg shadow-lg border-border">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
             <Avatar className="h-24 w-24 border-4 border-primary">
               {/* You can replace this with an actual image URL if available */}
               {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
               <AvatarFallback className="bg-muted text-muted-foreground">
                 <User className="h-12 w-12" />
               </AvatarFallback>
             </Avatar>
          </div>
          <CardTitle className="text-3xl font-bold">Minusha Attygala</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Developer & AI Enthusiast
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            This application, DiaPredict, was developed by Minusha Attygala.
            It utilizes AI to provide preliminary diabetes risk assessments based on user-provided health data.
          </p>
           {/* Add more details about Minusha Attygala here if needed */}
        </CardContent>
      </Card>
    </div>
  );
}
