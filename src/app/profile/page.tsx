import { Session } from "next-auth";
import Image from "next/image";
import { FaCreditCard } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";

import { auth } from "@/../auth";
import getUserByEmailAction from "@/action/user/getUserByEmailAction";
import Error from "@/components/Error";
import { Button } from "@/components/ui/button";
import styles from "@/constant/style";
import Link from "next/link";
import { FaUser } from "react-icons/fa6";

export default async function Profile() {
  const session = (await auth()) as Session;
  const user = session?.user.email
    ? await getUserByEmailAction(session?.user.email)
    : null;

  return user ? (
    <main className={styles.pageContainer}>
      <section className="mx-auto flex flex-col items-center gap-y-4 mt-10">
        <div className="profile_card aspect-[3/2]">
          <div className="profile_card_content p-8 flex flex-col items-center gap-y-4">
            <div className="w-[150px] h-[150px] bg-accent-foreground rounded-full overflow-hidden">
              {user?.image ? (
                <Image
                  src={user?.image}
                  alt={user?.name ?? "Image"}
                  width={150}
                  className="object-cover w-[150px] h-[150px]"
                  height={150}
                />
              ) : (
                <FaUser className="w-[150px] h-[150px] text-white" />
              )}
            </div>
            <h1 className="text-foreground text-center text-2xl font-semibold mb-5">
              {user?.name}
            </h1>

            <div className="flex flex-row items-center justify-center gap-x-4 text-muted-foreground">
              <div className="flex-row items-center flex gap-x-2">
                <FaCreditCard /> <span>Backed 0 Projects</span>
              </div>
              |
              <div className="flex-row items-center flex gap-x-2">
                <FaUserGroup /> <span>120 followers</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 items-center">
              <Button
                variant={"outline"}
                className="text-center text-primary w-fit bg-white hover:bg-gray-200 transition-colors duration-200 rounded-lg px-5 text-gray-900 hover:text-gray-700 font-semibold tracking-wider text-lg"
              >
                <Link
                  className="flex cursor-pointer flex-row items-center gap-x-2 "
                  href={"/profile/edit"}
                >
                  Edit <MdModeEdit />
                </Link>
              </Button>
              <Button size={"lg"}>
                <Link
                  className="flex cursor-pointer flex-row items-center gap-x-2 "
                  href={"/support/paymentAccount"}
                >
                  Payment Account <FaCreditCard className="text-lg" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="profile_card_glass" />
        </div>
      </section>
      <section className="max-w-2xl mx-auto flex flex-col items-center gap-y-4 mt-10 p-4">
        <h3 className="text-xl text-center font-semibold text-foreground">
          About You
        </h3>
        <p className="text-center text-foreground">
          {user?.bio ?? "You don't have any bio to show here."}
        </p>
      </section>
    </main>
  ) : (
    <Error message="We did not find user with given id. Please try to log in again" />
  );
}
