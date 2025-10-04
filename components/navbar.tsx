"use client";

import { Button } from "./ui/button";
import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="w-full border-b bg-background">
      <div className="max-w-6xl px-5 py-3 flex items-center justify-between">

        <Link href="/" className="text-xl font-semibold">
          Simple Data Explorer
        </Link>

      </div>
    </nav>
  );
};
