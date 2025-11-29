import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { Navbar } from "../components/Navbar";
import { CgArrowLeft, CgCamera } from "react-icons/cg";
import { IoMdCamera, IoMdSend } from "react-icons/io";
import { useRef } from "react";

const socket = io(`${import.meta.env.VITE_API_URI}`, {
  withCredentials: true,
});

const Room = () => {

  const messagesContainerRef = useRef(null);


  const [profile, setProfile] = useState({ name: "", color: "" });
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
            name: res.data.user.name,
            color: res.data.user.color,
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

  const sendMessage = (type = "text", messageContent = newMessage) => {
    if (!messageContent.trim()) return;

    socket.emit("sendMessage", {
      roomId: id,
      sender: profile.name,
      color: profile.color,
      type,
      content: messageContent,
    });

    if (type === "text") {
      setNewMessage("");
    }
  };

  useEffect(() => {
  const container = messagesContainerRef.current;
  if (container) {
    container.scrollTop = container.scrollHeight; // instant scroll
    // or smooth scroll:
    // container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }
}, [messages]);

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
          <div ref={messagesContainerRef} className="rounded md:h-[calc(100vh_-_230px)] h-[calc(100vh_-_200px)] overflow-y-auto">
            {
            messages.length === 0 
            ? 
            <div className="p-5 flex justify-center items-center w-full md:h-[calc(100vh_-_230px)] h-[calc(100vh_-_200px)] text-zinc-400">Loading messages...</div>
            :
            messages.map((msg, i) => (
              <div className="p-2  hover:bg-zinc-800 hover:rounded-md" key={i}>
                <div className="flex gap-3 items-center">
                  <span
                    style={{ backgroundColor: msg.color }}
                    className="rounded-full flex h-6 w-6 items-center justify-center text-white text-xs font-bold"
                  >
                    {msg.sender ? msg.sender[0] : "?"}
                  </span>
                  <div
                    style={{ color: msg.color }}
                    className="capitalize text-sm md:text-lg font-semibold"
                  >
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
                <div className="ml-10 text-sm overflow-x-hidden text-zinc-400 break-words whitespace-pre-wrap font-semibold">
                  {msg.type === "text" && msg.content}

                  {msg.type === "image" && (
                    <a href={msg.content} download={`image-${Date.now()}.png`}>
                      <img
                        src={msg.content}
                        className="rounded max-w-[200px] cursor-pointer"
                      />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 relative flex gap-2">
            <input
              className="w-full p-4 outline-none rounded-full bg-zinc-800 text-white"
              disabled={!profile.color}
              value={newMessage}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage("text");
                }
              }}
              placeholder="Enter a message..."
              onChange={(e) => setNewMessage(e.target.value)}
            />

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

            <label
              htmlFor="imageUpload"
              className="p-4 absolute right-18 text-2xl rounded-full cursor-pointer flex items-center justify-center"
            >
              <IoMdCamera />
            </label>

            <button
              className="bg-zinc-800 p-5 rounded-full"
              onClick={() => sendMessage("text")}
            >
              <IoMdSend />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Room;
