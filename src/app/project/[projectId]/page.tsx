import Image from "next/image";
import Link from "next/link";

import ProjectComments from "@/components/Project/ProjectComments";
import ProjectLikeComment from "@/components/Project/ProjectLikeComment";
import ProjectUserInfo from "@/components/Project/ProjectUserInfo";
import RelatedProjects from "@/components/Project/RelatedProjects";
import { buttonVariants } from "@/components/ui/button";
import styles from "@/constant/style";
import { project, support, user } from "../../../../db/types";

export const revalidate = 0;

export default async function ProjectDetailScreen({
  params,
}: {
  params: { projectId: string };
}) {
  const response = await fetch(
    `${process.env.URL}/api/project/detail/${params.projectId}`
  );
  const data = await response.json();

  if (data.code !== 200) {
    return (
      <section
        className={`${styles.pageContainer} flex flex-col gap-5 items-center justify-center`}
      >
        <Image
          src={"/error.png"}
          alt=""
          width={500}
          height={500}
          className="object-contain w-[30%]"
        />
        <h3 className="text-destructive text-center text-3xl">
          Whoops! An Error occured!
        </h3>
        <p className="text-gray-700 max-w-ms mx-auto text-pretty">
          {data.message}
        </p>
        <Link href={"/"} className={buttonVariants()}>
          Back to Home
        </Link>
      </section>
    );
  }

  const { project, user, support } = data.data as {
    project: project;
    user: user;
    support: support[];
  };

  const totalSupportAmount = support.reduce(
    (acc, entry) => acc + parseFloat(entry.amount),
    0
  );

  const totalAmount = Number(project?.currentAmout) + totalSupportAmount;

  return (
    <section className={`${styles.pageContainer} project_section`}>
      <div className="col-span-8 flex flex-col gap-5">
        {/* User Info */}
        <ProjectUserInfo
          userId={project.user_id}
          user={user}
          project={project}
        />
        {/* Project Card */}
        <div className="grid xl:grid-cols-2 grid-cols-1 rounded-3xl overflow-hidden bg-wheat_white xl:max-h-[600px]">
          <Image
            src={project.image}
            alt={project.title}
            width={500}
            height={500}
            className="xl:max-h-none max-h-[300px] object-cover object-center h-full w-full"
          />
          <div className="p-5">
            <h3 className="text-sm uppercase text-primary font-semibold">
              {project.subtitle}
            </h3>
            <h1 className="text-3xl font-bold text-pretty my-2">
              {project.title}
            </h1>
            <span className="mb-5 block">
              Project Category: {project.category}
            </span>
            <p className="text-gray-700 text-sm leading-loose text-pretty pt-4 mt-4 border-t">
              {project.description}
            </p>

            <div className="flex flex-col gap-3 border-t pt-4 mt-4">
              <span className="font-light">
                Goal Amount:{" "}
                <span className="font-normal">{project.goalAmount} $</span>
              </span>
              <span className="font-light">
                Current Amount:{" "}
                <span className="font-normal">{totalAmount} $</span>
              </span>
            </div>
          </div>
        </div>

        {/* Likes and Comments Section */}
        <ProjectLikeComment
          projectId={project.projectId!}
          createdBy={project.user_id}
        />

        <ProjectComments projectId={project.projectId!} />
      </div>

      {/* Related Projects */}
      <section className="col-span-4">
        <h3 className="text-lg font-semibold">Related Projects</h3>
        <RelatedProjects projectId={project.projectId!} />
      </section>
    </section>
  );
}
