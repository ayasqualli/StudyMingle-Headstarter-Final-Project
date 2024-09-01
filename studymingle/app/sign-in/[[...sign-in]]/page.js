'use client' // Client Component

import React from "react";
import { Container, Box } from "@mui/material";
import { SignIn, useAuth } from "@clerk/nextjs";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("isSignedIn:", isSignedIn);
    if (isSignedIn === true) {
      router.push('/dashboard'); // Redirect to the chat page after successful sign-in
    }
  }, [isSignedIn, router]); // Only run when isSignedIn changes

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
