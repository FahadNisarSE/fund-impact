import Image from "next/image";
import { IoIosWarning } from "react-icons/io";

import { project, user } from "../../../db/types";
import ProjectSupport from "./ProjectSupport";

export default function ProjectUserInfo({
  userId,
  user,
  project,
}: {
  userId: string;
  user: user | null;
  project: project;
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
          {project.createdAt && new Date(project.createdAt).toDateString()}
        </p>
      </div>
      <ProjectSupport projectId={project.projectId!} />
    </div>
  );
}
