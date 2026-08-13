"use client";
import { useEffect, useRef, useState } from "react";
import { ENCOURAGEMENTS } from "../data/encouragements";

export default function RandomEncouragement({ name = "Ngọc Diệp" }: { name?: string }) {
  const [msg, setMsg] = useState<string>("");
  const lastRef = useRef<number | null>(null);

  useEffect(() => {
    if (!ENCOURAGEMENTS || ENCOURAGEMENTS.length === 0) return;
    let idx = Math.floor(Math.random() * ENCOURAGEMENTS.length);
    // avoid repeating the same message twice in a row when possible
    if (ENCOURAGEMENTS.length > 1 && lastRef.current !== null) {
      let attempts = 0;
      while (idx === lastRef.current && attempts < 6) {
        idx = Math.floor(Math.random() * ENCOURAGEMENTS.length);
        attempts += 1;
      }
    }
    lastRef.current = idx;
    const chosen = ENCOURAGEMENTS[idx].replace("{name}", name);
    setMsg(chosen);
  }, [name]);

  if (!msg) return null;
  return <p className="mt-3 text-sm text-zinc-600">{msg}</p>;
}
