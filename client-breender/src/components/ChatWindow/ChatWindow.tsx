import React, { useEffect, useRef, useState } from 'react';
import { getChats, createChat } from '../../api/chatApi';
import { getMessagesByChat } from '../../api/messageApi';
import { getUser } from '../../api/userApi';
import { useUser } from '../../context/UserContext';
import { UserMention } from '../UserMention/UserMention';
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
  const [otherUser, setOtherUser] = useState<{ id: string; name: string; email: string; pictureUrl?: string | null } | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
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
    const fetchOtherUser = async () => {
      setProfileLoading(true);
      const res = await getUser(otherUserId, true);
      if (res.status === 200 && res.data) {
        setOtherUser({
          id: res.data.id,
          name: res.data.profile?.name || res.data.email || 'Unknown',
          email: res.data.email,
          pictureUrl: res.data.profile?.pictureUrl || null,
        });
      }
      setProfileLoading(false);
    };
    if (otherUserId) fetchOtherUser();
  }, [otherUserId]);

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

  if (loading) return <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>;
  if (!chatId) return <div>Could not start chat.</div>;

  return (
    <div className="chat-window card shadow p-3" style={{ maxWidth: 500, margin: '32px auto 0 auto', height: '80vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8f9fa' }}>
      <div className="chat-header bg-light text-dark p-2 rounded mb-3 d-flex align-items-center" style={{ minHeight: 56, border: '1px solid #e0e0e0' }}>
        {profileLoading ? (
          <span className="spinner-border spinner-border-sm me-2" role="status" />
        ) : otherUser ? (
          <UserMention
            userId={otherUser.id}
            userName={otherUser.name}
            userEmail={otherUser.email}
            userPictureUrl={otherUser.pictureUrl}
          />
        ) : (
          <span>User not found</span>
        )}
      </div>
      <div className="chat-messages flex-grow-1 overflow-auto mb-3" style={{ minHeight: 0 }}>
        {messages.map((msg) => (
          <div key={msg.id || msg._id || Math.random()} className={msg.senderId === userId ? 'text-end' : 'text-start'}>
            <div
              className={msg.senderId === userId ? 'bg-primary text-white d-inline-block rounded p-2 mb-1' : 'bg-light d-inline-block rounded p-2 mb-1'}
              style={{
                maxWidth: '75%',
                wordWrap: 'break-word',
                border: msg.senderId === userId ? '1.5px solid #1976d2' : '1.5px solid #bdbdbd',
                boxSizing: 'border-box',
                backgroundClip: 'padding-box',
              }}
            >
              {msg.content}
            </div>
            <div className="small text-muted" style={{ fontSize: '0.75em' }}>{msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString() : ''}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="d-flex gap-2 mt-auto">
        <input
          className="form-control"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="btn btn-primary" type="submit" disabled={!input.trim()}>Send</button>
      </form>
      <style>
        {`
          .chat-messages::-webkit-scrollbar {
            width: 8px;
          }
          .chat-messages::-webkit-scrollbar-thumb {
            background-color: #ced4da;
            border-radius: 4px;
          }
          .chat-messages::-webkit-scrollbar-track {
            background-color: #f8f9fa;
          }
        `}
      </style>
    </div>
  );
};
