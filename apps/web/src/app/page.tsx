"use client";
import { useEffect } from "react";
import { getEvent } from "@/utils/getEvent";

export default function Home() {
  // TODO landing page
  useEffect(() => {
    getEvent();
  }, []);
  return <main>metachain-LSD</main>;
}
