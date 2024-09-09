"use client";

import { FiSearch } from "react-icons/fi";

import { Input } from "../ui/input";
import Profile from "./Profile";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import NavSearch from "./NavSearch";

export const revalidate = 0;

export default function NavbarClient() {
  const { data } = useSession();

  return (
    <>
      <NavSearch />
      {data?.user?.role === "Creator" && (
        <Link className={cn(buttonVariants(), "mr-4")} href="/project/create">
          Create Project
        </Link>
      )}
      <Profile />
    </>
  );
}
