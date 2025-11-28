import { Navbar } from "../components/Navbar";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const Dashboard = ({ cardData }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URI}/check-auth`,
          { 
            headers: { Authorization: `Bearer ${token}` } ,
            withCredentials: true,
          }
        );
        if (!res.data.success) {
          navigate("/");
        }
      } catch {
        navigate("/");
      }
    };

    checkLogin();
  }, [navigate]);

  let data = "const showRooms = ()=>{";
  return (
    <div className="bg-zinc-900 min-h-screen">
      <Navbar />
      <div className="p-5">
        <h2 className="font-semibold text-white text-[40px]">Hello GENz</h2>
        <p className="text-zinc-600">
          Connect with fellow students across different topics.
        </p>
      </div>
      <p className="text-zinc-500 font-light p-5 text-[10px] ">{data} </p>
      <div className="p-3 flex md:flex-row justify-center flex-col gap-5 pb-10">
        {cardData.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            title={card.title}
            icon={card.icon}
            online={card.online}
            rules={card.rules}
          />
        ))}
      </div>
      <p className="text-zinc-500 font-light p-5 text-[10px]">{"};"}</p>
    </div>
  );
};

export default Dashboard;
