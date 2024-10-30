"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home/page";
import Chat from "./chat/[id]/page";
import { SocketProvider } from "@/context/SocketProvider";

export default function Page() {
  const { data: session, status } = useSession();
  useEffect(() => {
    console.log(session);
  }, [session]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat/:id" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}
