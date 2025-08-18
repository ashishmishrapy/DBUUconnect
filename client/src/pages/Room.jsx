import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { Navbar } from "../components/Navbar";
import { CgArrowLeft } from "react-icons/cg";

const socket = io("http://localhost:3000", { withCredentials: true });

const Room = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get("http://localhost:3000/check-auth", {
          withCredentials: true,
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
    // Join the room
    socket.emit("joinRoom", id);

    // Listen for messages
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit("leaveRoom", id);
      socket.off("message");
    };
  }, [id]);

  const sendMessage = () => {
    socket.emit("sendMessage", { roomId: id, text: newMessage });
    setNewMessage("");
  };

  return (
    <>
      <div className="bg-zinc-900 min-h-screen">
        <Navbar />
        <div className="p-5 text-white">
          <div className="flex gap-3 items-center">
            <button
            onClick={()=> navigate(-1)}
            className="p-1 cursor-pointer rounded-full bg-zinc-700">
              <CgArrowLeft className="font-bold text-xl" />
            </button>
            <h2 className="text-xl font-bold">Room #{id} </h2>
          </div>
          <div className="p-3 rounded h-80 overflow-y-auto">
            {messages.map((msg, i) => (
              <p key={i}>
               <span className={`text-white capitalize font-semibold`}>{name} </span> <span className="text-[10px] text-zinc-500">  {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span> <br /> <span className="font-semibold text-sm text-zinc-400">{msg}</span>
              </p>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              className="flex-1 p-2 rounded bg-zinc-700 text-white"
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
