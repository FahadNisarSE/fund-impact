"use client";

import { FiSearch } from "react-icons/fi";

import { Input } from "../ui/input";
import Profile from "./Profile";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

export default function NavbarClient() {
  const { data } = useSession();

  return (
    <>
      <div className="relative ml-auto mr-4">
        <FiSearch className="w-5 h-5 text-foreground absolute left-2 bottom-2" />

        <Input
          type="search"
          className="flex h-9 border border-input px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
          placeholder="Search..."
        />
      </div>
      {data?.user?.role === "Creator" && (
        <Link
          className={cn(buttonVariants({ variant: "outline" }), "mr-4 text-primary border-primary hover:text-white hover:bg-primary transition-colors")}
          href="/project/create"
        >
          Create Project
        </Link>
      )}
      <Profile />
    </>
  );
}
