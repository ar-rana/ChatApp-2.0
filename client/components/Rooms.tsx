"use client";
import React, { useEffect, useState } from "react";
import RoomCard from "./RoomCard";
import { signOut, useSession } from "next-auth/react";
import PrivateRoomCard from "./PrivateRoomCard";

const Rooms: React.FC = () => {
  interface Room {
    id: string;
    name: string;
    type: string;
    author: string;
  }
  const requestURL = "http://localhost:8000";

  const { data: session } = useSession();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [type, setType] = useState<string>("public");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [name, setName] = useState<string>();
  const [privateRooms, setprivateRooms] = useState<Room[]>([]);

  const getRooms = async (): Promise<void> => {
    const requestURI = `${requestURL}/rooms`;
    try {
      const res = await fetch(requestURI, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data: Room[] = await res.json();
        setRooms(data);
      } else {
        console.error(`Error fetching rooms: ${res.status}`);
      }
      //console.log(rooms);
    } catch (e) {
      console.log("Failed to fetch public rooms", e);
    }
  };

  const getPrivateRooms = async () => {
    const requestURI = `${requestURL}/room`;
    try {
      const email = session?.user?.email;
      const res = await fetch(requestURI, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          author: email,
        }),
      });

      if (res.ok) {
        const data: Room[] = await res.json();
        setprivateRooms(data);
        console.log(privateRooms);
      } else {
        console.error(`Error fetching private rooms: ${res.status}`);
      }
    } catch (e) {
      console.log("Error fetching auth key: ", e);
    }
  };

  const createRoom = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!name) return;

    const requestURI = `${requestURL}/create/room`;

    try {
      const res = await fetch(requestURI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          type: type,
          author: session?.user?.email,
        }),
      });

      if (res.ok) {
        const data: Room = await res.json();
        if (data.type === "private") {
          setprivateRooms([data, ...privateRooms]);
        } else {
          setRooms([data, ...rooms]);
        }
      } else {
        console.error(`Error creating room: ${res.status}`);
      }
    } catch (e) {
      console.error("Failed to create room: ", e);
    }

    setName("");
  };

  const callSignOut = async () => {
    try {
      signOut();
    } catch (e) {
      console.log("error occured during signout: ", e);
    }
  };

  const selectType = () => {
    if (type === "public") {
      setType("private");
    } else {
      setType("public");
    }
  };

  const handleToggle = () => {
    setIsPrivate(!isPrivate);
    selectType();
  };

  const handleDeleteRoom = (roomId: string) => {
    setRooms(rooms.filter((room) => room.id !== roomId));
  };

  const handleDeletePrivateRoom = (roomId: string) => {
    setprivateRooms(privateRooms.filter((room) => room.id !== roomId));
  };

  useEffect(() => {
    getRooms();
    getPrivateRooms();
  }, []);

  return (
    <div className="space-y-2">
      <form className="flex space-x-4">
        <input
          type="text"
          className="py-2 px-4 block w-[75%] border-transparent rounded-lg text-lg focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          placeholder="Room Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <div
          className="flex bg-blue-500 space-x-3 rounded-lg items-center p-2 cursor-pointer"
          onClick={() => {
            document.getElementById("private-checkbox")?.click();
            handleToggle();
          }}
        >
          <span className="bg-blue-500 text-white font-semibold">Private</span>
          <input
            type="checkbox"
            className="bg-blue-500 text-white h-10"
            id="private-checkbox"
            checked={isPrivate}
            onChange={handleToggle}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold p-2 rounded-lg px-4"
          onClick={createRoom}
        >
          Create Room
        </button>
      </form>
      <div className="mx-auto max-w-2xl sm:flex sm:space-x-3 p-3 bg-white border rounded-lg shadow-lg shadow-gray-100 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-gray-900/20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {privateRooms.map((room) => (
            <PrivateRoomCard
              key={room.id}
              id={room.id}
              name={room.name}
              author={room.author}
              onDelete={handleDeletePrivateRoom}
            />
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-2xl sm:flex sm:space-x-3 p-3 bg-white border rounded-lg shadow-lg shadow-gray-100 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-gray-900/20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              id={room.id}
              name={room.name}
              author={room.author}
              onDelete={handleDeleteRoom}
            />
          ))}
        </div>
      </div>
      <button
        onClick={callSignOut}
        type="submit"
        className="bg-black text-white font-semibold p-2 rounded-full px-4 hover:shadow-md hover:shadow-white"
      >
        Sign Out 👋🏼
      </button>
    </div>
  );
};

export default Rooms;
