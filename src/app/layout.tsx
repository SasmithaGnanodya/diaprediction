import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter for a clean, modern font
import './globals.css';
import { Toaster } from "@/components/ui/toaster" // Import Toaster
import { MainNavigation } from '@/components/main-navigation'; // Import the new client component

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'DiaPredict - Diabetes Prediction Tool', // Updated title
  description: 'Predict the likelihood of diabetes based on patient data using AI.', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen`}> {/* Use Inter font and antialiasing, ensure full height */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
               <MainNavigation /> {/* Use the client component here */}
            </div>
        </header>
        <main className="flex-grow"> {/* Ensure main content area grows */}
         {children}
        </main>
         <footer className="mt-auto py-6 text-center text-sm text-muted-foreground bg-background border-t"> {/* Footer sticks to bottom */}
          © {new Date().getFullYear()} DiaPredict. All rights reserved. | Disclaimer: For informational purposes only.
      </footer>
        <Toaster /> {/* Add Toaster for notifications */}
      </body>
    </html>
  );
}
