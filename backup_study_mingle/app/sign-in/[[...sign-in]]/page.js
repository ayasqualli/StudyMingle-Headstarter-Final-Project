'use client' // Client Component

import React from "react";
import { Container, Box } from "@mui/material";
import { SignIn, useAuth, useUser } from "@clerk/nextjs";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      // Check if onboarding is completed
      if (user.publicMetadata.onboardingCompleted) {
        router.push('/dashboard'); // Redirect to the dashboard if completed
      } else {
        router.push('/onboarding'); // Redirect to onboarding if not completed
      }
    }
  }, [user, router]);

  return (
    <Box
      style={{
        display: "flex",
        minHeight: "100vh",
        minWidth: "100vw",
      }}
    >
      <Box
        style={{
          width:"80%", // Takes up the remaining space
          backgroundImage: 'url("/register-login.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <Box
        style={{
          width: "580px", // Set a fixed width for the form container
          background: "#ffcd93",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Optional shadow for better visibility
          borderRadius: "8px",
        }}
      >
        <SignIn />
      </Box>
    </Box>
  );
}
