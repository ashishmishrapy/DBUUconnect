import React from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export const Navbar = () => {
  const [profileMenu, setProfileMenu] = useState(false);
  const navigate = useNavigate();
  const logOutHandle = async () => {
    try {
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="bg-zinc-800 flex justify-between backdrop-shadow-2xl items-center py-2 px-5 md:px-15">
      <h1 className="md:text-[30px] text-[20px] text-amber-600 text-shadow-black text-shadow-md font-black tracking-tighter">
        DBUU{" "}
        <span className="text-[20px] text-zinc-600 text-shadow-none font-light">
          connect
        </span>
      </h1>
      <div className="flex gap-3 justify-center relative items-center">
        <IoIosNotificationsOutline className="font-bold text-white p-3 text-[45px] hover:bg-zinc-700 active:bg-zinc-700 rounded" />
        <CgProfile
          onMouseEnter={() => setProfileMenu(true)}
          onMouseLeave={() => setProfileMenu(false)}
          className="font-bold text-white p-3 text-[45px] hover:bg-zinc-700 active:bg-zinc-700 rounded"
        />
        <div
          onMouseEnter={() => setProfileMenu(true)}
          onMouseLeave={() => setProfileMenu(false)}
          className={`absolute bg-zinc-300 flex flex-col items-center justify-center rounded w-20 h-20 text-zinc-700 font-medium top-11 ${
            !profileMenu && "hidden"
          } `}
        >
          <Link className="hover:text-black" to="/profile">
            Profile
          </Link>
          <button onClick={logOutHandle}>
            <a
              href="/login"
              className="hover:text-black"
              >
              Logout
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};
