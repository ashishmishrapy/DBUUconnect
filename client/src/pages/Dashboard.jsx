import { Navbar } from '../components/Navbar'
import Card from '../components/Card'
import { MdMenuBook } from "react-icons/md";
import { MdOutlineLaptopChromebook } from "react-icons/md";
import { FaRegKissWinkHeart } from "react-icons/fa";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';




const Dashboard = () => {
  // const navigate = useNavigate()
  //  useEffect(() => {
  //   const checkLogin = async () => {
  //     try {
  //       const res = await axios.get("https://dbuuconnect-backend.onrender.com/check-auth", {
  //         withCredentials: true
  //       });

  //       if (res.data.success) {
  //         navigate("/dashboard");
  //       }
  //     } catch {
  //       navigate("/login"); // If request fails, go to login
  //     }
  //   };

  //   checkLogin();
  // }, []);

  const cardData = [
  {
    id: 1,
    title: "Study Hall",
    icon: <MdMenuBook />,
    online: 142,
    rules: [
      "Academic discussions and study groups",
      "Don't Spam.",
      "Only Study talks allowed."
    ]
  },
  {
    id: 2,
    title: "Coding Zone",
    icon: <MdOutlineLaptopChromebook />,
    online: 87,
    rules: [
      "Ask and answer coding questions",
      "Share resources and projects",
      "Respect other learners"
    ]
  },
  {
    id: 3,
    title: "Fun Lounge",
    icon: <FaRegKissWinkHeart />,
    online: 54,
    rules: [
      "Casual chat and memes",
      "Keep it friendly",
      "Flirting allowed"
    ]
  }
];

  let data = "const showRooms = ()=>{"
  return (
    <div className='bg-zinc-900 min-h-screen'>
        <Navbar />
        <div className='p-5'>
          <h2 className='font-semibold text-white text-[40px]'>Hello GENz</h2>
          <p className='text-zinc-600'>Connect with fellow students across different topics.</p>
        </div>
          <p className='text-zinc-500 font-light p-5 text-[10px] '>{data} </p>
        <div className='p-3 flex md:flex-row justify-center flex-col gap-5 pb-10'>
          {
            cardData.map((card)=>(
              <Card key={card.id} title={card.title} icon={card.icon} online={card.online} rules={card.rules} />
            ))
          }
        </div>
    </div>
  )
}

export default Dashboard