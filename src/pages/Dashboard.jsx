import { Navbar } from "../components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import { MdChat, MdPeople, MdPerson, MdNotifications } from "react-icons/md";
import { useAuth } from "../hooks";
import { motion } from "framer-motion";
import { useMemo, memo, useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "../firebase/config";

// Memoized Card Component
const DashboardCard = memo(({ card, index, onClick }) => {
  const Icon = card.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all cursor-pointer border border-white/10 hover:border-white/20"
    >
      <div className={`${card.color} ${card.hoverColor} p-4 rounded-xl inline-block mb-4 transition-colors`}>
        <Icon className="text-white text-4xl" />
      </div>
      <h3 className="text-white text-2xl font-bold mb-2">{card.title}</h3>
      <p className="text-zinc-400 text-sm">{card.description}</p>
      <div className="mt-4 flex items-center text-amber-600 font-semibold text-sm">
        <span>Explore</span>
        <span className="ml-2">→</span>
      </div>
    </motion.div>
  );
});

DashboardCard.displayName = "DashboardCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mentions, setMentions] = useState([]);

  const cards = useMemo(() => [
    {
      title: "Global Chat",
      description: "Connect with all DBUU students in one place",
      icon: MdChat,
      color: "bg-amber-600",
      hoverColor: "hover:bg-amber-700",
      path: "/chat",
    },
    {
      title: "Students",
      description: "Browse and connect with fellow students",
      icon: MdPeople,
      color: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
      path: "/students",
    },
    {
      title: "My Profile",
      description: "View and edit your profile information",
      icon: MdPerson,
      color: "bg-green-600",
      hoverColor: "hover:bg-green-700",
      path: "/profile",
    },
  ], []);

  useEffect(() => {
    if (!user?.username) return;

    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      orderBy("createdAt", "desc"),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const mentionedMessages = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(msg => 
          msg.type === "text" && 
          msg.content?.includes(`@${user.username}`) &&
          msg.sender !== user.name
        )
        .slice(0, 5);
      
      setMentions(mentionedMessages);
    });

    return () => unsubscribe();
  }, [user?.username, user?.name]);

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="p-5 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-bold text-white text-[40px] md:text-[50px] mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h2>
          <p className="text-zinc-400 text-lg mb-8">
            What would you like to do today?
          </p>
        </motion.div>

        {mentions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-6xl mx-auto mb-8"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <MdNotifications className="text-amber-600 text-2xl" />
                <h3 className="text-white text-xl font-bold">Recent Mentions</h3>
                <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full">{mentions.length}</span>
              </div>
              <div className="space-y-2">
                {mentions.map((mention) => (
                  <div
                    key={mention.id}
                    onClick={() => navigate('/chat', { state: { scrollToMessage: mention.id } })}
                    className="bg-white/5 hover:bg-white/10 p-4 rounded-lg cursor-pointer transition-all border border-white/5 hover:border-amber-600/50"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={mention.avatar}
                        alt={mention.sender}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-semibold text-sm">{mention.sender}</span>
                          <span className="text-gray-500 text-xs">
                            {mention.createdAt ? new Date(mention.createdAt.toDate()).toLocaleDateString() : ''}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm line-clamp-2">{mention.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {cards.map((card, index) => (
            <DashboardCard
              key={card.title}
              card={card}
              index={index}
              onClick={() => navigate(card.path)}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 max-w-6xl mx-auto"
        >
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 rounded-2xl shadow-xl">
            <h3 className="text-white text-xl font-bold mb-2">🎉 Quick Tip</h3>
            <p className="text-white/90 text-sm">
              Start a conversation in the Global Chat or browse through Students to find your classmates!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
