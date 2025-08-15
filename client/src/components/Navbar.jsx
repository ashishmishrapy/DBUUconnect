import React from 'react'
import { IoIosNotificationsOutline } from "react-icons/io";
import { CgProfile } from "react-icons/cg";

export const Navbar = () => {
  return (
    <div className='bg-zinc-800 flex justify-between backdrop-shadow-2xl items-center py-2 px-5 md:px-15'>
        <h1 className='text-[30px] text-amber-600 text-shadow-black text-shadow-md font-black tracking-tighter'>DBUU <span className='text-[20px] text-zinc-600 text-shadow-none font-light'>connect</span></h1>
        <div className='flex gap-3 justify-center items-center'>
            <IoIosNotificationsOutline className='font-bold text-white p-3 text-[45px] hover:bg-zinc-700 active:bg-zinc-700 rounded'  />
            <CgProfile className='font-bold text-white p-3 text-[45px] hover:bg-zinc-700 active:bg-zinc-700 rounded' />
        </div>
    </div>
  )
}
