/* eslint-disable @next/next/no-img-element */
'use client' // Client Component

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function StudyMingle() {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/logo-removebg.png" alt="Study Mingle Cat Logo" />
        </div>
        <h1 className={styles.title}>Study Mingle</h1>
        <div className={styles.headerButtons}>
          <button 
            onClick={() => handleNavigation('/sign-up')} 
            className={styles.signUpButton}
          >
            Sign Up
          </button>
          <button 
            onClick={() => handleNavigation('/sign-in')} 
            className={styles.loginButton}
          >
            Login
          </button>
        </div>
      </header>
      
      <main className={styles.main}>
        <div className={styles.contentBox}>
          <h2 className={styles.greeting}>Hey Minglers,</h2>
          <p className={styles.tagline}>Ready to change the way you learn?</p>
          <button 
            onClick={() => handleNavigation('/sign-up')} 
            className={styles.createAccountButton}
          >
            Create Account
          </button>
          <p className={styles.description}>
            Our clever AI will pair you with study pals who match your vibe and style.
          </p>
        </div>
        
        <div className={styles.mascotCard}>
          <img src="/cat-meow-removebg.png" alt="Cat Mascot" className={styles.mascotImage}/>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2024 Study Mingle. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <a href="https://www.instagram.com/study_mingle">Instagram Page</a>
          <a href="https://studymingle.pages.dev">Waitlist</a>
        </div>
      </footer>
    </div>
  );
}
