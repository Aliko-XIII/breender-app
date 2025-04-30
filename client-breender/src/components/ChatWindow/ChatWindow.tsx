import React, { useEffect, useRef, useState } from 'react';
import { getChats, createChat } from '../../api/chatApi';
import { getMessagesByChat, sendMessage } from '../../api/messageApi';
import { useUser } from '../../context/UserContext';

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

  // Find or create chat between users
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

  // Fetch messages
  useEffect(() => {
    if (!chatId) return;
    const fetchMessages = async () => {
      const res = await getMessagesByChat(chatId);
      if (res.status === 200 && Array.isArray(res.data)) {
        setMessages(res.data);
      }
    };
    fetchMessages();
    // Optionally: add polling or websockets for real-time
  }, [chatId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatId || !userId) return;
    const res = await sendMessage({ chatId, senderId: userId, content: input });
    if (res.status === 200 || res.status === 201) {
      setMessages((prev) => [...prev, res.data]);
      setInput('');
    }
  };

  if (loading) return <div>Loading chat...</div>;
  if (!chatId) return <div>Could not start chat.</div>;

  return (
    <div className="chat-window card shadow p-3" style={{ maxWidth: 500, margin: '0 auto', height: 500, display: 'flex', flexDirection: 'column' }}>
      <div className="chat-messages flex-grow-1 overflow-auto mb-3" style={{ minHeight: 0 }}>
        {messages.map((msg) => (
          <div key={msg.id} className={msg.senderId === userId ? 'text-end' : 'text-start'}>
            <div className={msg.senderId === userId ? 'bg-primary text-white d-inline-block rounded p-2 mb-1' : 'bg-light d-inline-block rounded p-2 mb-1'}>
              {msg.content}
            </div>
            <div className="small text-muted" style={{ fontSize: '0.75em' }}>{new Date(msg.sentAt).toLocaleTimeString()}</div>
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
