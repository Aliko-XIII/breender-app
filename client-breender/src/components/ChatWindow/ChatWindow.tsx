import React, { useEffect, useRef, useState } from 'react';
import { getChats, createChat } from '../../api/chatApi';
import { getMessagesByChat } from '../../api/messageApi';
import { useUser } from '../../context/UserContext';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SERVER_URL);

interface ChatWindowProps {
  otherUserId: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  sentAt: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ otherUserId }) => {
  const { userId } = useUser();
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchOrCreateChat = async () => {
      setLoading(true);
      const chatsRes = await getChats();
      let chat = null;
      if (chatsRes.status === 200 && Array.isArray(chatsRes.data)) {
        chat = chatsRes.data.find((c: any) =>
          c.participants &&
          c.participants.some((p: any) => p.userId === userId) &&
          c.participants.some((p: any) => p.userId === otherUserId)
        );
      }
      if (!chat) {
        const createRes = await createChat([userId, otherUserId]);
        if (createRes.status === 200 || createRes.status === 201) {
          chat = createRes.data;
        }
      }
      if (chat) setChatId(chat.id);
      setLoading(false);
    };
    if (userId && otherUserId) fetchOrCreateChat();
  }, [userId, otherUserId]);

  useEffect(() => {
    if (!chatId) return;
    setMessages([]);
    socket.emit('joinChat', { chatId });
    const messageHandler = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };
    socket.on('receiveMessage', messageHandler);
    socket.on('connect', () => {
      console.log('Connected to WebSocket server:', socket.id);
    });
    return () => {
      socket.off('receiveMessage', messageHandler);
    };
  }, [chatId]);

  useEffect(() => {
    if (!chatId) return;
    const fetchMessages = async () => {
      const res = await getMessagesByChat(chatId);
      if (res.status === 200 && Array.isArray(res.data)) {
        setMessages(res.data);
      }
    };
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatId || !userId) return;
    socket.emit('sendMessage', { chatId, senderId: userId, content: input });
    setInput('');
  };

  if (loading) return <div>Loading chat...</div>;
  if (!chatId) return <div>Could not start chat.</div>;

  return (
    <div className="chat-window card shadow p-3" style={{ maxWidth: 500, margin: '0 auto', height: 500, display: 'flex', flexDirection: 'column' }}>
      <div className="chat-messages flex-grow-1 overflow-auto mb-3" style={{ minHeight: 0 }}>
        {messages.map((msg) => (
          <div key={msg.id || msg._id || Math.random()} className={msg.senderId === userId ? 'text-end' : 'text-start'}>
            <div className={msg.senderId === userId ? 'bg-primary text-white d-inline-block rounded p-2 mb-1' : 'bg-light d-inline-block rounded p-2 mb-1'}>
              {msg.content}
            </div>
            <div className="small text-muted" style={{ fontSize: '0.75em' }}>{msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString() : ''}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="d-flex gap-2">
        <input
          className="form-control"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="btn btn-primary" type="submit" disabled={!input.trim()}>Send</button>
      </form>
    </div>
  );
};
