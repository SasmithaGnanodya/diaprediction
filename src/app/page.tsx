'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Zap, ShieldCheck, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold tracking-tight text-primary mb-4">Welcome to DiaPredict</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Leveraging the power of Artificial Intelligence to provide early insights into diabetes risk. Early detection can lead to better management and improved health outcomes.
        </p>
         <Link href="/predict" passHref>
           <Button size="lg" className="mt-8">Get Started with Prediction</Button>
        </Link>
      </section>

      <section className="grid md:grid-cols-3 gap-8 mb-16">
        <Card className="shadow-lg border-border hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="text-primary" /> Early Awareness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Understanding your potential risk factors early allows for proactive lifestyle changes and consultations with healthcare professionals. Knowledge empowers prevention.
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-border hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="text-primary" /> Informed Decisions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Our AI considers key health indicators like age, BMI, and other factors to provide a preliminary risk assessment, helping you have more informed discussions with your doctor.
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-border hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="text-primary" /> Community Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Diabetes is a growing global concern. Tools like DiaPredict contribute to broader awareness and encourage timely screening and management within the community.
            </p>
          </CardContent>
        </Card>
      </section>

       <section className="text-center bg-accent/50 p-8 rounded-lg border border-border">
         <h2 className="text-3xl font-semibold mb-4 text-primary-foreground">Why Predict Diabetes Risk?</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
           Diabetes can lead to serious health complications if left unmanaged. Identifying risk factors early is crucial. Factors like age, weight, height (which determine BMI), and family history play significant roles. While DiaPredict provides an AI-based estimate, it's a starting point, not a diagnosis. Always consult a healthcare provider for accurate assessment and guidance.
         </p>
          <Link href="/about" passHref>
           <Button variant="secondary">Learn More About Us</Button>
         </Link>
       </section>

    </div>
  );
}
