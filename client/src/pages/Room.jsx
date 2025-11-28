import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { Navbar } from "../components/Navbar";
import { CgArrowLeft } from "react-icons/cg";

const socket = io(`${import.meta.env.VITE_API_URI}`, {
  withCredentials: true,
});

const Room = () => {
  const [profile, setProfile] = useState({name: "", color: ""});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URI}/check-auth`,
          { headers: { Authorization: `Bearer ${token}` } },
          {
            withCredentials: true,
          }
        );
        
        if (!res.data.success) {
          navigate("/");
        } else {
          setProfile({
            name : res.data.user.name,
            color : res.data.user.color
          });
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
    socket.emit("sendMessage", { roomId: id, text: newMessage, sender: profile.name, color: profile.color });
    setNewMessage("");
  };

  return (
    <>
      <div className="bg-zinc-900 min-h-screen">
        <Navbar />
        <div className="md:p-5 p-1 mt-2 text-white">
          <div className="flex gap-3 mb-4 pl-3 items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-1 cursor-pointer rounded-full bg-zinc-700"
            >
              <CgArrowLeft className="font-bold text-md md:text-xl" />
            </button>
            <h2 className="text-sm md:text-lg font-bold">Room #{id} </h2>
          </div>
          <div className="rounded md:h-[calc(100vh_-_270px)] h-[calc(100vh_-_230px)] overflow-y-auto">
            {messages.map((msg, i) => (
              <div className="p-2  hover:bg-zinc-800 hover:rounded-md" key={i}>
                <div className="flex gap-3 items-center">
                  <span
                   style={{ backgroundColor: msg.color }}
                  className="rounded-full flex h-6 w-6 items-center justify-center text-white text-xs font-bold">
                    {msg.sender ? msg.sender[0] : "?"}
                  </span>
                  <div
                   style={{ color: msg.color }}
                  className="capitalize text-sm md:text-lg font-semibold">
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

          <div className="mt-3  flex flex-col gap-2">
            <input
              className="w-full p-2 outline-none rounded bg-zinc-700 text-white"
              disabled={!profile.color}
              value={newMessage}
              onKeyDown={e =>{
                if(e.key=="Enter"){
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Enter a message..."
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
