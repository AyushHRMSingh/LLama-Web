import Image from "next/image";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    <>
      <h1>Home</h1>
      <a href="/login">Login stuff</a>
    </>
  );
}
