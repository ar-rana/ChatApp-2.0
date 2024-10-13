"use client";
import Messages from "@/components/messages";
import { useSocket } from "@/context/SocketProvider";
import { useSession } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface message {
  id: string;
  text: string;
  from: string;
  createdAt: any;
  room: string;
}

const Chat: React.FC = () => {
  const requestURL = "http://localhost:8000";

  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const { sendMessage } = useSocket();
  const [message, setMessage] = useState("");
  const [roomMessages, setroomMessages] = useState<message[]>([]);

  const { data: session } = useSession();

  const searchParams = useSearchParams();
  // const roomName = searchParams.get("name");
  const roomType = searchParams.get("type");

  const getPrivateMessages = async () => {
    const requestURI = `${requestURL}/messages`;
    try {
      const res = await fetch(requestURI, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomid: id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setroomMessages(data);
      } else {
        console.error(`Error fetching rooms: ${res.status}`);
      }
      //console.log(rooms);
    } catch (e) {
      console.log("Failed to fetch public rooms", e);
    }
  };

  useEffect(() => {
    if (roomType === "private") {
      getPrivateMessages();
    }
  }, []);

  return (
    <div className="h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full flex flex-col">
        <div className="relative mx-auto grid space-y-5 sm:space-y-10 h-full max-w-2xl">
          <div className="mx-auto p-5 bg-white border rounded-lg shadow-lg shadow-gray-100 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-gray-900/20 flex flex-col h-full">
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                className="py-2 px-4 block w-full border-transparent rounded-lg text-lg focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                placeholder="message"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white font-semibold p-2 rounded-lg px-4"
                onClick={(e) => {
                  sendMessage(
                    JSON.stringify({
                      text: message,
                      room: id,
                      from: session?.user?.email,
                    })
                  );
                  setMessage("");
                }}
              >
                Send
              </button>
            </div>
            <div className="flex-1 p-4 scrollbar-hide">
              <div className="flex flex-col space-y-2">
                <Messages thisRoom={id!} sender={session?.user?.email!} />
              </div>
              <div className="flex flex-col space-y-2 mt-2">
                {roomMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.from === session?.user?.email
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg max-w-[80%] text-black flex ${
                        msg.from === session?.user?.email
                          ? "bg-blue-300"
                          : "bg-white"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
