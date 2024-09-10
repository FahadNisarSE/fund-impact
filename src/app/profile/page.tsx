import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { FaCreditCard } from "react-icons/fa";
import { FaUser, FaUserGroup } from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";
import { redirect } from "next/navigation";

import { auth } from "@/../auth";
import getUserByEmailAction from "@/action/user/getUserByEmailAction";
import Error from "@/components/Error";
import { Button } from "@/components/ui/button";
import styles from "@/constant/style";
import UsersProjects from "@/components/Profile/UsersProject";

export default async function Profile() {
  const session = (await auth()) as Session;

  if (!session?.user?.id) {
    redirect("/auth/signin");
    return null;
  }

  const userPromise = getUserByEmailAction(session.user.email!);
  let statisticsPromise;

  if (session.user.role === "Creator") {
    statisticsPromise = fetch(
      `${process.env.URL}/api/users/getUserProjectsAndPosts/${session.user.id}`
    );
  } else {
    statisticsPromise = fetch(
      `${process.env.URL}/api/users/getUserSupport/${session.user.id}`
    );
  }

  const [user, statisticsResponse] = await Promise.all([
    userPromise,
    statisticsPromise,
  ]);

  const statisticData = await statisticsResponse.json();
  let statisticsCreator;
  let statisticsSupporter;
  if (session.user.role === "Creator") {
    statisticsCreator = statisticData?.data as {
      projects: number;
      posts: number;
    };
  } else {
    statisticsSupporter = statisticData?.data as number;
  }

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
            <div className="flex items-center">
              <h1 className="text-foreground mr-1 text-center text-2xl font-semibold">
                {user?.name}
              </h1>
              <span>({user?.userRole})</span>
            </div>

            <div className="flex flex-row items-center justify-center gap-x-4 text-muted-foreground">
              {session.user.role === "Creator" ? (
                <>
                  <div className="flex-row items-center flex gap-x-2">
                    <FaCreditCard />
                    <span>
                      Created {statisticsCreator?.projects ?? 0} Projects
                    </span>
                  </div>
                  |
                  <div className="flex-row items-center flex gap-x-2">
                    <FaUserGroup />{" "}
                    <span>{statisticsCreator?.posts ?? 0} posts</span>
                  </div>
                </>
              ) : (
                // If the user is not a "Creator", show a different statistic (support count)
                <div className="flex-row items-center flex gap-x-2">
                  <FaCreditCard />
                  <span>Supported {statisticsSupporter ?? 0} Projects</span>
                </div>
              )}
            </div>
          </div>
          <div className="profile_card_glass" />
        </div>
      </section>
      <section className="flex justify-center gap-2 items-center mt-10">
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
        {user.userRole === "Creator" ? (
          <Button size={"lg"}>
            <Link
              className="flex cursor-pointer flex-row items-center gap-x-2 "
              href={"/support/paymentAccount"}
            >
              Payment Account <FaCreditCard className="text-lg" />
            </Link>
          </Button>
        ) : (
          <></>
        )}
      </section>
      <section className="max-w-2xl mx-auto flex flex-col items-center gap-y-4 my-10 p-4">
        <h3 className="text-xl text-center font-semibold text-foreground">
          About You
        </h3>
        <p className="text-center text-foreground text-gray-600">
          {user?.bio ?? "You don't have any bio to show here."}
        </p>
      </section>
      <UsersProjects />
    </main>
  ) : (
    <Error message="We did not find user with given id. Please try to log in again" />
  );
}
