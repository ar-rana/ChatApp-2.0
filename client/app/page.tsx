"use client";

import { useSocket } from "@/context/SocketProvider";
import { useState } from "react";

export default function Page() {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState("");
  return (
    <div className="bg-red-500">
      <div>
        <p>Send Messages: </p>
      </div>
      <input
        onChange={(e) => setMessage(e.target.value)}
        className="w-28 h-10 border border-spacing-1"
        placeholder="message"
      />
      <button
        onClick={(e) => sendMessage(message)}
        className="bg-white text-black"
      >
        Send
      </button>
      <div>
        <div className="bg-black">
          {messages.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </div>
      </div>
    </div>
  );
}
