import { db } from '../../../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const { roomId } = await request.json();

    if (!roomId) {
        return NextResponse.json({ error: "Room ID is required" }, { status: 400 });
    }

    const roomDocRef = doc(db, 'rooms', roomId);
    const roomDoc = await getDoc(roomDocRef);

    if (roomDoc.exists()) {
        return NextResponse.json({ message: "Room already exists" }, { status: 200 });
    } else {
        await setDoc(roomDocRef, {
            createdAt: new Date().toISOString(),
        });
        return NextResponse.json({ message: "Room created" }, { status: 201 });
    }
}
