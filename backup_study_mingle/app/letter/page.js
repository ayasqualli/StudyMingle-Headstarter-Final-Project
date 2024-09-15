/* eslint-disable @next/next/no-img-element */
'use client' // Client Component

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import styles from './LetterCover.module.css';

export default function LetterCover() {
  const [isOpened, setIsOpened] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpened) {
      setTimeout(() => {
        // Fade out animation before navigating
        document.querySelector(`.${styles.letterCoverContainer}`).style.opacity = '0';
        setTimeout(() => {
          router.push('/');
        }, 1000); // Wait for the fade-out animation
      }, 2000); // Adjust the timing for the flaps animation
    }
  }, [isOpened, router]);

  return (
    <div className={styles.letterCoverContainer} onClick={() => setIsOpened(true)}>
      <div className={`${styles.letter} ${isOpened ? styles.opened : ''}`}>
        <div className={styles.triangularFlapTop}></div>
        <div className={styles.triangularFlapBottom}></div>
        <div className={styles.triangularFlapLeft}></div>
        <div className={styles.triangularFlapRight}></div>
        <div className={styles.seal}>
          <img src="/logo-removebg.png" alt="Cat Mascot" className={styles.catMascot} />
        </div>
      </div>
      <h1 className={styles.title}>Study Mingle</h1>
      <p className={styles.clickText}>Click On This Letter!</p>
    </div>
  );
}
