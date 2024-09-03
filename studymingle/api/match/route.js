import { db } from '../../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const { user1Id, user2Id } = await request.json();

    if (!user1Id || !user2Id) {
        return NextResponse.json({ error: "User IDs are required" }, { status: 400 });
    }

    // Create a unique room ID (e.g., using a combination of user IDs or a generated UUID)
    const roomId = `${user1Id}_${user2Id}`; // Adjust to your needs

    // Create the room in Firebase
    const roomDocRef = doc(db, 'rooms', roomId);
    await setDoc(roomDocRef, {
        createdAt: new Date().toISOString(),
        participants: [user1Id, user2Id],
    });

    // Return the room ID
    return NextResponse.json({ roomId }, { status: 201 });
}
