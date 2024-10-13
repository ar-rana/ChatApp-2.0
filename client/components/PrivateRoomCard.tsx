import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  id: string;
  name: string;
  author: string;
  onDelete: (id : string) => void;
}

const PrivateRoomCard: React.FC<Props> = ({ name, id, author, onDelete }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const requestURL = "http://localhost:8000";

  const deleteRoom = async () => {
    const requestURI = `${requestURL}/room`;
    try {
      const res = await fetch(requestURI, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      });
      if (res.ok) {
        onDelete(id);
      }
    } catch (e) {
      console.log("Failed to delete rooms", e);
    }
  };

  return (
    <div className="bg-green-300 border border-black rounded-lg overflow-hidden shadow-sm">
      <div className="flex flex-col p-4">
        <div className="flex space-x-3 items-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">{name}</h3>
          {session?.user?.email === author ? (
            <button
              className="bg-red-500 text-white font-semibold p-2 rounded-xl px-2"
              onClick={deleteRoom}
            >
              Delete
            </button>
          ) : (
            ""
          )}
        </div>
        <div>
          <p className="text-gray-600 mb-4 truncate">Private Room</p>
          <button
            onClick={() => router.push(`/chat/${id}`)}
            className="mr-auto bg-blue-500 text-white font-normal lg:font-semibold md:font-semibold p-2 rounded-full px-4"
          >
            दोस्तों के साथ बातचीत करॆं
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivateRoomCard;
