"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CreateProjectMenu() {
  const pathname = usePathname();
  return (
    <nav className="grid gap-4 col-span-2 h-fit sticky top-0 text-sm text-muted-foreground">
      <Link
        href="/project/create"
        className={`${
          pathname === "/project/create" && "font-semibold text-primary"
        }`}
      >
        Basics
      </Link>
      <Link
        href="/project/create/fund"
        className={`${
          pathname === "/project/create/fund" && "font-semibold text-primary"
        }`}
      >
        Funding
      </Link>
      <Link
        href="/project/create/duration"
        className={`${
          pathname === "/project/create/duration" &&
          "font-semibold text-primary"
        }`}
      >
        Duration
      </Link>
      <Link
        href="/project/create/review"
        className={`${
          pathname === "/project/create/review" && "font-semibold text-primary"
        }`}
      >
        Review
      </Link>
    </nav>
  );
}
