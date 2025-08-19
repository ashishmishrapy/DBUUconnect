import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { Navbar } from "../components/Navbar";
import { CgArrowLeft } from "react-icons/cg";

const socket = io("https://dbuuconnect-backend.onrender.com/check-auth", { withCredentials: true });

const Room = ({colors}) => {
  const [name, setName] = useState("");
  const token = localStorage.getItem("token")
  const navigate = useNavigate();
  useEffect(() => {
    const checkLogin = async () => {
      try {
          const res = await axios.get("https://dbuuconnect-backend.onrender.com/check-auth", {headers: { Authorization: `Bearer ${token}` }}, {
          withCredentials: true
        });

        if (!res.data.success) {
          navigate("/");
        } else {
          setName(res.data.user.name);
        }
      } catch {
        navigate("/");
      }
    };
    checkLogin();
  }, [navigate]);

  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

 useEffect(() => {
  socket.emit("joinRoom", id);

  socket.on("roomHistory", (history) => {
    setMessages(history);
  });

  socket.on("message", (msg) => {
    setMessages((prev) => [...prev, msg]);
  });

  return () => {
    socket.emit("leaveRoom", id);
    socket.off("message");
    socket.off("roomHistory");
  };
}, [id]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    socket.emit("sendMessage", { roomId: id, text: newMessage, sender: name });
    setNewMessage("");
  };

  return (
    <>
      <div className="bg-zinc-900 min-h-screen">
        <Navbar />
        <div className="md:p-5 p-1 mt-2 text-white">
          <div className="flex gap-3 mb-4 items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-1 cursor-pointer rounded-full bg-zinc-700"
            >
              <CgArrowLeft className="font-bold text-md md:text-xl" />
            </button>
            <h2 className="text-sm md:text-lg font-bold">Room #{id} </h2>
          </div>
          <div className="p-3 rounded h-80 overflow-y-auto">
            {messages.map((msg, i) => (
              <div className="mb-2" key={i}>
                <div className="flex gap-3 items-center">
                  <span className="rounded-full bg-amber-600 flex h-6 w-6 items-center justify-center text-white text-xs font-bold">
                    {msg.sender ? msg.sender[0] : "?"}
                  </span>
                  <div className="text-white capitalize text-sm md:text-lg font-semibold">
                    {msg.sender}{" "}
                    <span className="text-[8px] md:text-[10px] text-zinc-500">
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>
                </div>
                <div className="font-semibold ml-10 text-sm text-zinc-400">
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <input
              className="flex-1 p-2 outline-none rounded bg-zinc-700 text-white"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              className="bg-blue-500 px-4 py-2 rounded"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Room;
