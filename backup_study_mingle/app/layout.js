import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
const inter = Inter({ subsets: ["latin"] });
import { Analytics } from "@vercel/analytics/react";

// Extract environment variables
const clerkApiKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const clerkSecretKey = process.env.CLERK_SECRET_KEY;

export const metadata = {
  title: "StudyMingle",
  description: "Find your Perfect Study Buddy",
};

export default function RootLayout({ children }) {
  const clerkAppearance = {
    layout: {
      socialButtonsVariant: "iconButton",
      socialButtonsPlacement: "bottom",
    },
    elements: {
      formButtonPrimary: {
        fontSize: "16px",
        fontWeight: "600",
        textTransform: "none",
        backgroundColor: "#3f51b5",
        "&:hover": {
          backgroundColor: "#303f9f",
        },
      },
      card: {
        border: "none",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
      },
      formFieldInput: {
        borderRadius: "4px",
      },
    },
  };

  return (
    <ClerkProvider
      publishableKey={clerkApiKey}
      secretKey={clerkSecretKey}
      appearance={clerkAppearance}
    >
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
      <Analytics />
    </ClerkProvider>
  );
}
