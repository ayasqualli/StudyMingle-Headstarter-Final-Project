'use client' // Client Component

import React from "react";
import { Container, Box } from "@mui/material";
import { SignUp, useAuth } from "@clerk/nextjs";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  //Redirection to chat after signup
  useEffect(() => {
    console.log("isSignedIn:", isSignedIn);
    if (isSignedIn === true) {
      router.push('/chat'); // Redirect to the chat page after successful sign-in
    }
  }, [isSignedIn]); // Only run when isSignedIn changes (dependency change)

  return (
    <>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          minWidth: "100vw", // Ensures the background covers the full width
          position: "absolute", // Makes sure it spans the entire viewport
          top: 0,
          left: 0,
          backgroundImage: 'url("/bg2.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Container
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            background: "rgba(255, 255, 255, 0.1)", // Optional overlay for readability
            borderRadius: "8px",
          }}
        >
          <SignUp />
        </Container>
      </Box>
    </>
  );
}