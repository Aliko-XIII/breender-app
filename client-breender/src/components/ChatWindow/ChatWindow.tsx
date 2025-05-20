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

interface Chat {
  id: string;
  participants: Array<{ userId: string }>;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ otherUserId }) => {
  const { userId } = useUser();
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState<{ id: string; name: string; email: string; pictureUrl?: string | null } | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [sidebarLoading, setSidebarLoading] = useState(true);
  const [sidebarUsers, setSidebarUsers] = useState<Record<string, { id: string; name: string; email: string; pictureUrl?: string | null }>>({});
  const [lastMessages, setLastMessages] = useState<Record<string, { content: string; sentAt: string }>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch all chats for sidebar
  useEffect(() => {
    const fetchChats = async () => {
      setSidebarLoading(true);
      const chatsRes = await getChats();
      if (chatsRes.status === 200 && Array.isArray(chatsRes.data)) {
        setChats(chatsRes.data);
      }
      setSidebarLoading(false);
    };
    if (userId) fetchChats();
  }, [userId]);

  // Fetch user info and last message for all sidebar chats
  useEffect(() => {
    const fetchSidebarData = async () => {
      const userMap: Record<string, { id: string; name: string; email: string; pictureUrl?: string | null }> = {};
      const lastMsgMap: Record<string, { content: string; sentAt: string }> = {};
      for (const chat of chats.filter(chat => chat.participants.some(p => p.userId === userId))) {
        const other = chat.participants.find((p) => p.userId !== userId);
        if (other && !userMap[other.userId]) {
          const res = await getUser(other.userId, true);
          if (res.status === 200 && res.data) {
            userMap[other.userId] = {
              id: res.data.id,
              name: res.data.profile?.name || res.data.email || 'Unknown',
              email: res.data.email,
              pictureUrl: res.data.profile?.pictureUrl || null,
            };
          }
        }
        // Fetch last message for this chat
        const resMsg = await getMessagesByChat(chat.id);
        if (resMsg.status === 200 && Array.isArray(resMsg.data) && resMsg.data.length > 0) {
          const lastMsg = resMsg.data[resMsg.data.length - 1];
          lastMsgMap[chat.id] = { content: lastMsg.content, sentAt: lastMsg.sentAt };
        }
      }
      setSidebarUsers(userMap);
      setLastMessages(lastMsgMap);
    };
    if (chats.length > 0 && userId) fetchSidebarData();
  }, [chats, userId]);

  // Select chat from sidebar or by prop
  useEffect(() => {
    if (chats.length > 0 && otherUserId) {
      const found = chats.find((c: Chat) =>
        c.participants &&
        c.participants.some((p) => p.userId === userId) &&
        c.participants.some((p) => p.userId === otherUserId)
      );
      if (found) {
        setSelectedChat(found);
        setChatId(found.id);
      } else {
        setSelectedChat(null);
        setChatId(null);
      }
    }
  }, [chats, otherUserId, userId]);

  // Fetch or create chat if not found
  useEffect(() => {
    const fetchOrCreateChat = async () => {
      setLoading(true);
      let chat: Chat | null = null;
      if (chats.length > 0) {
        chat = chats.find((c: Chat) =>
          c.participants &&
          c.participants.some((p) => p.userId === userId) &&
          c.participants.some((p) => p.userId === otherUserId)
        ) || null;
      }
      if (!chat && userId && otherUserId) {
        const createRes = await createChat([userId, otherUserId]);
        if ((createRes.status === 200 || createRes.status === 201) && createRes.data) {
          chat = createRes.data as Chat;
          // Only add if not already present (by id)
          setChats(prev => prev.some(c => c.id === chat!.id) ? prev : [...prev, chat!]);
        }
      }
      if (chat) {
        setChatId(chat.id);
        setSelectedChat(chat);
      }
      setLoading(false);
    };
    if (userId && otherUserId && chats.length >= 0) fetchOrCreateChat();
    // eslint-disable-next-line
  }, [userId, otherUserId]);

  // Fetch other user info for header when selectedChat changes
  useEffect(() => {
    const fetchOtherUser = async () => {
      setProfileLoading(true);
      let otherId = otherUserId;
      if (selectedChat) {
        const other = selectedChat.participants.find((p) => p.userId !== userId);
        if (other) otherId = other.userId;
      }
      const res = await getUser(otherId, true);
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
    if (selectedChat || otherUserId) fetchOtherUser();
  }, [selectedChat, otherUserId, userId]);

  // Socket join and receive
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

  // Fetch messages for selected chat
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

  // Sidebar chat select handler
  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setChatId(chat.id);
    // Find the other user in this chat
    const other = chat.participants.find((p) => p.userId !== userId);
    if (other) {
      // This will trigger useEffect to fetch other user info
      window.history.replaceState(null, '', `/chat/${other.userId}`);
    }
  };

  if (loading) return <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>;
  if (!chatId) return <div>Could not start chat.</div>;

  return (
    <div className="d-flex" style={{ height: '80vh', maxWidth: 900, margin: '32px auto 0 auto' }}>
      {/* Sidebar */}
      <div className="chat-sidebar bg-white border-end p-2" style={{ width: 260, overflowY: 'auto' }}>
        <h6 className="mb-3">Chats</h6>
        {sidebarLoading ? (
          <div className="spinner-border spinner-border-sm" role="status" />
        ) : (
          <ul className="list-unstyled mb-0">
            {chats
              .filter(chat => chat.participants.some(p => p.userId === userId))
              .map((chat) => {
                const other = chat.participants.find((p) => p.userId !== userId);
                const user = other ? sidebarUsers[other.userId] : null;
                const lastMsg = lastMessages[chat.id];
                return (
                  <li key={chat.id}>
                    <button
                      className={`btn btn-sm w-100 text-start mb-1 d-flex align-items-center ${selectedChat && selectedChat.id === chat.id ? 'btn-primary text-white' : 'btn-light'}`}
                      onClick={() => handleSelectChat(chat)}
                      style={{ minHeight: 64 }}
                    >
                      <img
                        src={user?.pictureUrl && user.pictureUrl !== ''
                          ? (user.pictureUrl.startsWith('http')
                              ? user.pictureUrl
                              : `${import.meta.env.VITE_SERVER_URL}${user.pictureUrl}`)
                          : '/avatar-placeholder.png'}
                        alt={user?.name || 'User'}
                        style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', marginRight: 12, border: '1px solid #ccc', background: '#fff' }}
                      />
                      <div className="flex-grow-1 text-start" style={{ minWidth: 0 }}>
                        <div className="fw-bold text-truncate" style={{ maxWidth: 140 }}>{user?.name || `User ${other?.userId}`}</div>
                        <div className="small text-muted text-truncate" style={{ maxWidth: 140 }}>{user?.email}</div>
                        {lastMsg && (
                          <div className="small text-truncate" style={{ maxWidth: 140 }}>
                            <span className="text-secondary">{lastMsg.content}</span>
                            <span className="ms-2 text-muted" style={{ fontSize: '0.75em' }}>{new Date(lastMsg.sentAt).toLocaleTimeString()}</span>
                          </div>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
          </ul>
        )}
      </div>
      {/* Main chat area */}
      <div className="chat-window card shadow p-3 flex-grow-1 d-flex flex-column" style={{ backgroundColor: '#f8f9fa' }}>
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
            <div key={msg.id} className={msg.senderId === userId ? 'text-end' : 'text-start'}>
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
    </div>
  );
};
