import { db } from '../../../firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');

    if (!roomId) {
        return NextResponse.json({ error: "Room ID is required" }, { status: 400 });
    }

    try {
        const messagesQuery = query(
            collection(db, `rooms/${roomId}/messages`),
            orderBy('createdAt')
        );
        const messagesSnapshot = await getDocs(messagesQuery);
        const messages = messagesSnapshot.docs.map(doc => doc.data());

        return NextResponse.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}

export async function POST(request) {
    const { roomId, userId, message } = await request.json();

    if (!roomId || !userId || !message) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        const newMessage = {
            userId,
            message,
            createdAt: new Date().toISOString(),
        };

        await addDoc(collection(db, `rooms/${roomId}/messages`), newMessage);

        return NextResponse.json(newMessage, { status: 201 });
    } catch (error) {
        console.error("Error saving message:", error);
        return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
    }
}
