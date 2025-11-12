import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PrepAI",
  description: "AI-powered Interview Preparation Platform",
  openGraph: {
    title: "PrepAI",
    description: "AI-powered Interview Preparation Platform",
    siteName: "PrepAI",
    images: [
      {
        url: "/prepai-logo.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/browser-client-icon.ico" />
      </head>
      <body
        className={cn(
          inter.className,
          "antialiased min-h-screen",
        )}
      >
        <ClerkProvider
          signInFallbackRedirectUrl={"/dashboard"}
          afterSignOutUrl={"/sign-in"}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
