import { GoDotFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";

const Card = ({ id, title, icon, online, rules }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/room/${id}`);
  };

  return (
    <div className="md:w-[30%] rounded-md p-3 text-white w-full bg-zinc-800">
      <div className="flex justify-between mb-10">
        <h3 className="flex flex-col text-3xl font-semibold">
          {icon} {title}
        </h3>
        <span className="flex items-center">
          <GoDotFill className="text-green-600" />
          {online}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <ul>
          {rules.map((rule, index) => (
            <li key={index} className="list-disc ml-5">
              {rule}
            </li>
          ))}
        </ul>
        <button
          onClick={handleClick}
          className="bg-blue-600 px-3 py-2 rounded-md cursor-pointer hover:bg-blue-800 active:bg-blue-800"
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Card;
