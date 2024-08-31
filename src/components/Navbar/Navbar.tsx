import Image from "next/image";
import Link from "next/link";

import { auth } from "@/../auth";
import NavbarClient from "./NavbarClient";

type item = { href: string; title: string; disabled: boolean }[];

export default async function Navbar() {
  const session = await auth();
  let items: item = [];

  if (session) {
    if (session?.user.role === "Creator") {
      items.push({ title: "Home", href: "/", disabled: false });
      items.push({ title: "Profile", href: "/profile", disabled: false });
    } else {
      items.push({ title: "Home", href: "/", disabled: false });
      items.push({ title: "Profile", href: "/profile", disabled: false });
    }
  }

  return (
    <nav className="shadow-sm shadow-black/15 backdrop-blur-xl fixed top-0 w-full z-50">
      <div className="flex flex-row items-center max-w-7xl mx-auto p-5">
        <Link href={"/"} className="">
          <Image
            src="/logo.svg"
            alt="Fund Impack"
            width={200}
            height={100}
            className="object-contain"
          />
        </Link>

        <ul className="flex flex-row items-center gap-4 ml-6">
          {items.map((item) => (
            <li
              key={item.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Link href={item.href}>{item?.title}</Link>
            </li>
          ))}
        </ul>
        <NavbarClient />
      </div>
    </nav>
  );
}
