"use client";

import { useSocket } from "@/context/SocketProvider";

interface props {
  thisRoom: string;
  sender: string | undefined;
}

const Messages: React.FC<props> = ({ thisRoom, sender }) => {
  const { messages } = useSocket();

  const filteredMessages = messages.filter((msg) => {
    const messageData = JSON.parse(msg);
    return messageData.room === thisRoom; 
  });

  return (
    <div className="flex flex-col space-y-2 overflow-y-auto">
      {filteredMessages.map((msg, i) => {
        const messageData = JSON.parse(msg); 
        const isSender = messageData.from === sender;

        return (
          <div
            key={i}
            className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-2 rounded-lg max-w-[80%] ${
                isSender ? 'bg-blue-300 text-black' : 'bg-white text-black'
              }`}
            >
              {messageData.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
