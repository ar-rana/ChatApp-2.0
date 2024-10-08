import React from "react";
import RoomCard from "./RoomCard";
import { signOut } from "next-auth/react";

const Rooms: React.FC = () => {
  const rooms = [
    {
      id: "1qd3d2f2",
    },
    {
      id: "22d3cwe2",
    },
    {
      id: "32f32f32",
    },
  ];
  return (
    <div className="space-y-2">
        <form className="flex space-x-4">
            <input type="text" className="py-3 px-4 block w-[75%] border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Room-id"/>
            <button type="submit" className="bg-blue-500 text-white font-semibold p-2 rounded-full px-4">Create Room</button>
        </form>
      <div className="mx-auto max-w-2xl sm:flex sm:space-x-3 p-3 bg-white border rounded-lg shadow-lg shadow-gray-100 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-gray-900/20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Dummy Rooms */}
          {rooms.map((room, i) => (
            <RoomCard key={room.id} id={room.id} index={i} />
          ))}
        </div>
      </div>
      <button onClick={() => signOut()} type="submit" className="bg-black text-white font-semibold p-2 rounded-full px-4 hover:shadow-md hover:shadow-white">Sign Out 👋🏼</button>
    </div>
  );
};

export default Rooms;
