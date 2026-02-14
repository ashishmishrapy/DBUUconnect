import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef, useCallback, memo } from "react";
import { IoMdSend } from "react-icons/io";
import { BsPlusCircleFill } from "react-icons/bs";
import { HiHashtag } from "react-icons/hi";
import { IoArrowBack } from "react-icons/io5";
import { BiReply } from "react-icons/bi";
import { useAuth } from "../hooks";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

// Memoized Message Component
const Message = memo(({ msg, onReply, onProfileClick }) => {
  const [touchStart, setTouchStart] = useState(0);
  const [touchOffset, setTouchOffset] = useState(0);
  const avatarUrl = msg.avatar || "https://www.citypng.com/public/uploads/preview/white-user-member-guest-icon-png-image-701751695037005zdurfaim0y.png";
  
  const renderContent = (content) => {
    if (!content) return null;
    const mentionRegex = /@(\w+)/g;
    const parts = content.split(mentionRegex);
    return parts.map((part, i) => 
      i % 2 === 1 ? (
        <span key={i} className="bg-amber-600/30 text-amber-400 px-1 rounded">@{part}</span>
      ) : part
    );
  };
  
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    const offset = e.touches[0].clientX - touchStart;
    if (offset > 0 && offset <= 80) {
      setTouchOffset(offset);
    }
  };

  const handleTouchEnd = () => {
    if (touchOffset > 40) {
      onReply(msg);
    }
    setTouchOffset(0);
  };

  return (
    <div 
      id={`msg-${msg.id}`}
      className="relative px-4 py-2 hover:bg-white/5 group transition-colors"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ transform: `translateX(${touchOffset}px)`, transition: touchOffset === 0 ? 'transform 0.2s' : 'none' }}
    >
      {touchOffset > 0 && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
          <BiReply className="text-2xl" style={{ opacity: Math.min(touchOffset / 40, 1) }} />
        </div>
      )}
      <div className="flex gap-4">
        <img
          src={avatarUrl}
          alt={msg.sender}
          className="w-10 h-10 rounded-full mt-1 cursor-pointer hover:ring-2 hover:ring-amber-600 transition-all"
          loading="lazy"
          onClick={() => onProfileClick(msg.senderUsername)}
          onError={(e) => {
            e.target.src = "https://www.citypng.com/public/uploads/preview/white-user-member-guest-icon-png-image-701751695037005zdurfaim0y.png";
          }}
        />
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span 
              className="text-sm font-semibold text-white hover:underline cursor-pointer"
              onClick={() => onProfileClick(msg.senderUsername)}
            >
              {msg.sender}
            </span>
            <span className="text-[11px] text-gray-500">
              {msg.createdAt
                ? new Date(msg.createdAt.toDate()).toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </span>
          </div>
          {msg.replyTo && (
            <div className="text-[11px] text-gray-500 mb-1 pl-3 border-l-2 border-gray-600">
              <span className="font-semibold text-gray-400">{msg.replyTo.sender}</span>: {msg.replyTo.content?.substring(0, 50)}{msg.replyTo.content?.length > 50 ? '...' : ''}
            </div>
          )}
          <div className="text-gray-300 text-[15px] mt-0.5 break-words">
            {msg.type === "text" && renderContent(msg.content)}
            {msg.type === "image" && (
              <img
                src={msg.content}
                alt="Shared"
                className="rounded-lg max-w-full w-auto h-auto max-h-96 mt-2 cursor-pointer object-contain"
                loading="lazy"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

Message.displayName = "Message";

const Room = () => {
  const messagesContainerRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"), limit(100));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersQuery = query(collection(db, "users"));
      const snapshot = await getDocs(usersQuery);
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllUsers(users);
    };
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);

    const lastAtIndex = value.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const searchTerm = value.slice(lastAtIndex + 1);
      if (!searchTerm.includes(' ')) {
        setMentionSearch(searchTerm);
        setShowMentions(true);
        return;
      }
    }
    setShowMentions(false);
  };

  const insertMention = (username) => {
    const lastAtIndex = newMessage.lastIndexOf('@');
    const newText = newMessage.slice(0, lastAtIndex) + `@${username} `;
    setNewMessage(newText);
    setShowMentions(false);
  };

  const filteredUsers = allUsers.filter(u => 
    u.username?.toLowerCase().includes(mentionSearch.toLowerCase())
  ).slice(0, 5);

  const sendMessage = useCallback(async (type = "text", messageContent = newMessage) => {
    if (!messageContent.trim() || !user) return;

    try {
      await addDoc(collection(db, "messages"), {
        sender: user.name,
        senderUsername: user.username,
        avatar: user.avatar || "https://www.citypng.com/public/uploads/preview/white-user-member-guest-icon-png-image-701751695037005zdurfaim0y.png",
        color: user.color,
        type,
        content: messageContent,
        replyTo: replyingTo,
        createdAt: serverTimestamp(),
      });

      if (type === "text") {
        setNewMessage("");
        setReplyingTo(null);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [newMessage, user, replyingTo]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
      
      const scrollToMessage = location.state?.scrollToMessage;
      if (scrollToMessage) {
        setTimeout(() => {
          const messageElement = document.getElementById(`msg-${scrollToMessage}`);
          if (messageElement) {
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            messageElement.classList.add('bg-amber-600/20');
            setTimeout(() => messageElement.classList.remove('bg-amber-600/20'), 2000);
          }
        }, 500);
      }
    }
  }, [messages, location.state]);

  return (
    <div className="flex h-screen bg-black">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-12 px-4 flex items-center border-b border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition-colors mr-3"
          >
            <IoArrowBack className="text-xl" />
          </button>
          <HiHashtag className="text-gray-400 text-xl mr-2" />
          <h2 className="text-white font-semibold text-[15px]">global-chat</h2>
        </div>

        {/* Messages Area */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto bg-transparent"
        >
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg) => <Message key={msg.id} msg={msg} onReply={setReplyingTo} onProfileClick={(username) => navigate(`/user/${username}`)} />)
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-transparent relative">
          {showMentions && filteredUsers.length > 0 && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden max-h-48">
              {filteredUsers.map(u => (
                <div
                  key={u.id}
                  onClick={() => insertMention(u.username)}
                  className="px-4 py-2 hover:bg-white/10 cursor-pointer flex items-center gap-2"
                >
                  <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full" />
                  <span className="text-white text-sm">{u.username}</span>
                </div>
              ))}
            </div>
          )}
          {replyingTo && (
            <div className="bg-white/5 backdrop-blur-xl rounded-t-lg px-4 py-2 flex items-center justify-between border border-white/10">
              <div className="text-[11px] text-gray-500">
                <span className="text-white font-semibold text-xs">Replying to {replyingTo.sender}</span>
                <p className="truncate">{replyingTo.content?.substring(0, 50)}</p>
              </div>
              <button onClick={() => setReplyingTo(null)} className="text-gray-500 hover:text-white text-sm">
                ✕
              </button>
            </div>
          )}
          <div className="bg-white/5 backdrop-blur-xl rounded-lg flex items-center px-4 py-3 shadow-lg border border-white/10">
            <button
              onClick={() => document.getElementById("imageUpload").click()}
              className="text-gray-400 hover:text-gray-200 transition-colors mr-3"
            >
              <BsPlusCircleFill className="text-2xl" />
            </button>
            <input
              type="file"
              accept="image/*"
              hidden
              id="imageUpload"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  sendMessage("image", reader.result);
                };
                reader.readAsDataURL(file);
              }}
            />
            <input
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-[15px]"
              disabled={!user}
              value={newMessage}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage("text");
                }
              }}
              placeholder="Message #global-chat"
              onChange={handleInputChange}
            />
            <button
              onClick={() => sendMessage("text")}
              disabled={!newMessage.trim()}
              className="text-gray-400 hover:text-white transition-colors ml-3 disabled:opacity-30"
            >
              <IoMdSend className="text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
