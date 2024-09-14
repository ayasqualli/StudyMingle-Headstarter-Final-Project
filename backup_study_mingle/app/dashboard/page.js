'use client' // Client Component

import React, { useState, useEffect, useRef } from 'react';
import { useClerk } from '@clerk/nextjs';
import TinderCard from 'react-tinder-card';
import styles from "./dashboard.module.css";

const Dashboard = () => {
    const { signOut } = useClerk();
    const [loading, setLoading] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: '',
        age: '',
        location: '',
        levelOfStudy: '',
        subjects: '',
        interests: ''
    });
    const [people, setPeople] = useState([]);
    const [lastDirection, setLastDirection] = useState();
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentIndexRef = useRef(currentIndex);

    const childRefs = useRef(
        Array(people.length)
            .fill(0)
            .map(() => React.createRef())
    );

    useEffect(() => {
        // Simulate fetching user data and people list from the database
        setTimeout(() => {
            setUserInfo({
                name: 'John Doe',
                age: '20',
                location: 'New York',
                levelOfStudy: 'University',
                subjects: 'Computer Science, Mathematics',
                interests: 'Coding, Music, Travel'
            });
            setPeople([
                {
                    name: 'Jummat',
                    age: 22,
                    bio: 'Under-grad Mechanical studies',
                    location: 'Malaysia'
                },
                {
                    name: 'Sarah',
                    age: 21,
                    bio: 'Art student with a passion for painting',
                    location: 'Singapore'
                },
                {
                    name: 'Mike',
                    age: 23,
                    bio: 'Aspiring entrepreneur and tech enthusiast',
                    location: 'Indonesia'
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    const handleLogout = () => {
        signOut();
    };

    const updateCurrentIndex = (val) => {
        setCurrentIndex(val);
        currentIndexRef.current = val;
    };

    const canSwipe = currentIndex >= 0;

    const swiped = (direction, nameToDelete, index) => {
        updateCurrentIndex(index - 1);
        console.log('removing: ' + nameToDelete);
    };

    const outOfFrame = (name, idx) => {
        console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
        if (currentIndexRef.current >= idx) {
            childRefs.current[idx].current.restoreCard();
        }
    };

    const swipe = async (dir) => {
        if (canSwipe && currentIndex < people.length) {
            await childRefs.current[currentIndex].current.swipe(dir);
        }
    };

    return (
        <div className={styles.dashboard}>
            <div className={styles.logo}>
                <img src="/logo-removebg.png" alt="Cute Logo" />
            </div>
            <aside className={styles.sidebar}>
                <div className={styles['menu-items']}>
                    <div className={styles['menu-item']}>
                        <span className={styles.icon}>🏠</span>
                        <span className={styles.text}>Home</span>
                    </div>
                    <div className={styles['menu-item']}>
                        <span className={styles.icon}>🔍</span>
                        <span className={styles.text}>Search</span>
                    </div>
                    <div className={styles['menu-item']}>
                        <span className={styles.icon}>✉️</span>
                        <span className={styles.text}>DM's</span>
                    </div>
                    <div className={styles['menu-item']}>
                        <span className={styles.icon}>🔔</span>
                        <span className={styles.text}>Notifications</span>
                    </div>
                </div>
            </aside>
            
            <main className={styles['main-content']}>
                <div className={styles['user-profile']} onClick={toggleProfile}>
                    <img src="cat-meow.png" alt="Profile" />
                </div>
                
                {isProfileOpen && (
                    <div className={styles['user-profile-view']}>
                        <div className={styles['profile-header']}>
                            <h2>Your Profile</h2>
                            <button className={styles['close-button']} onClick={toggleProfile}>×</button>
                        </div>
                        <div className={styles['profile-item']}>
                            <strong>Name:</strong> {userInfo.name}
                        </div>
                        <div className={styles['profile-item']}>
                            <strong>Age:</strong> {userInfo.age}
                        </div>
                        <div className={styles['profile-item']}>
                            <strong>Location:</strong> {userInfo.location}
                        </div>
                        <div className={styles['profile-item']}>
                            <strong>Level of Study:</strong> {userInfo.levelOfStudy}
                        </div>
                        <div className={styles['profile-item']}>
                            <strong>Subjects:</strong> {userInfo.subjects}
                        </div>
                        <div className={styles['profile-item']}>
                            <strong>Interests:</strong> {userInfo.interests}
                        </div>
                        <button className={styles['logout-button']} onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                )}
                
                <section className={styles['home-page']}>
                    <div className={styles['card-container']}>
                        {people.map((person, index) => (
                            <TinderCard
                                ref={childRefs.current[index]}
                                className={styles.swipe}
                                key={person.name}
                                onSwipe={(dir) => swiped(dir, person.name, index)}
                                onCardLeftScreen={() => outOfFrame(person.name, index)}
                            >
                                <div className={styles.card}>
                                    <div className={styles.location}>{person.location}</div>
                                    <img 
                                        src={`https://via.placeholder.com/300x400?text=${person.name.replace(/\s/g, '+')}`} 
                                        alt={person.name}
                                    />
                                    <div className={styles['card-content']}>
                                        <h3>{person.name}, {person.age}</h3>
                                        <p>{person.bio}</p>
                                    </div>
                                </div>
                            </TinderCard>
                        ))}
                    </div>
                    <div className={styles['action-bar']}>
                        <button className={`${styles['action-button']} ${styles.decline}`} onClick={() => swipe('left')}>❌</button>
                        <button className={`${styles['action-button']} ${styles.accept}`} onClick={() => swipe('right')}>❤️</button>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Dashboard;