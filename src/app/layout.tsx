import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google'; // Using Inter for a clean, modern font
import './globals.css';
import { Toaster } from "@/components/ui/toaster" // Import Toaster
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"; // Import NavigationMenu components
import { HeartPulse } from 'lucide-react'; // Import icon for logo

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
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <HeartPulse className="h-6 w-6 text-primary" />
                    <span className="font-bold inline-block">
                      DiaPredict
                    </span>
                </Link>
                <NavigationMenu className="hidden md:flex">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Link href="/" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Home
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                         <NavigationMenuItem>
                            <Link href="/predict" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Predict
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/about" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                About
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                {/* Add Mobile Menu Trigger if needed later */}
            </div>
        </header>
        <main className="flex-grow"> {/* Ensure main content area grows */}
         {children}
        </main>
         <footer className="mt-auto py-6 text-center text-sm text-muted-foreground bg-background border-t"> {/* Footer sticks to bottom */}
          © {new Date().getFullYear()} DiaPredict. All rights reserved. | Disclaimer: For informational purposes only.
          <br />
          Built with Firebase Studio & Genkit AI.
      </footer>
        <Toaster /> {/* Add Toaster for notifications */}
      </body>
    </html>
  );
}
