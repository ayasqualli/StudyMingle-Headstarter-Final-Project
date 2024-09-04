import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function ChatRoom() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const router = useRouter();
    const { roomId } = router.query;  
    const userId = "yourUserId"; // Replace with actual user ID logic

    useEffect(() => {
        async function fetchMessages() {
            if (roomId) {
                const response = await fetch(`/api/chat?roomId=${roomId}`);
                const data = await response.json();
                setMessages(data);
            }
        }

        fetchMessages();
    }, [roomId]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                roomId,
                userId,
                message: newMessage,
            }),
        });

        const savedMessage = await response.json();
        setMessages([...messages, savedMessage]);
        setNewMessage('');
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.userId}:</strong> {msg.message}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
}
