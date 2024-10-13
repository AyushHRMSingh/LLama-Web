"use client";
import { getResourceServer } from "@/functions/accessResource";
import { getChatList } from "@/functions/getChatList";
// import { useAuth } from "@/context/user.context";

export default function Page() {
  doot();
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}

async function doot() {
  console.log("start");
  const {token, addr}:any = await getResourceServer();
  await getChatList(addr, token);
  console.log("end");
}