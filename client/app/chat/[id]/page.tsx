"use client"
import { useSocket } from "@/context/SocketProvider";
import React, { useState } from "react";

const Chat: React.FC = () => {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState("");
  return (
    <div className="m-12">
      <div>
        <p className="font-bold">Send Messages: </p>
      </div>
      <input
        onChange={(e) => setMessage(e.target.value)}
        className="h-10 border border-black"
        placeholder="message"
      />
      <button
        onClick={(e) => sendMessage(message)}
        className="ml-4 bg-slate-400 rounded-lg p-2"
      >
        Send
      </button>
      <div>
        <div className="">
          {messages.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chat;
