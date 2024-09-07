import { IoIosWarning } from "react-icons/io";
import Image from "next/image";

import { posts, user } from "../../../db/types";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

export default function PostUserInfo({
  userId,
  user,
  post,
}: {
  userId: string;
  user: user;
  post: posts;
}) {
  if (!user) {
    return (
      <div className="flex items-center gap-4 text-destructive">
        <IoIosWarning className="w-16 h-16" />
        <p className="text-base">{"Somehting went wrong!"}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 h-fit">
      <Image
        src={user.image ?? "/user.png"}
        width={56}
        height={56}
        alt={user.name ?? "user image"}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div className="mr-auto">
        <h3 className="text-lg font-semibold">{user.name}</h3>
        <p className="text-sm text-gray-700">
          Created At:{" "}
          {post.createdAt && new Date(post.createdAt).toDateString()}
        </p>
      </div>
      <Link href={`/project/${post.projectId}`} className={buttonVariants()}>
        View Project
      </Link>
    </div>
  );
}
