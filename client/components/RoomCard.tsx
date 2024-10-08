import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  id: string;
  index: number;
}

const RoomCard: React.FC<Props> = ({ index, id }) => {
  const router = useRouter();

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="flex flex-col p-6 mr-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Room-{index + 1}
        </h3>
        <p className="text-gray-600 mb-4">Id: {id}</p>
        <button
          onClick={() => router.push(`/chat/${id}`)}
          className="mr-auto bg-blue-500 text-white font-normal lg:font-semibold md:font-semibold p-2 rounded-full px-4"
        >
          दोस्तों के साथ बातचीत करॆं
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
