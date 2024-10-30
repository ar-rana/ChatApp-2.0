"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home/page";
import Chat from "./chat/[id]/page";

export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log(session);
  }, [session]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat:id" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}
