import Image from "next/image";

import styles from "@/constant/style";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { project } from "../../../../db/types";
import ProjectUserInfo from "@/components/Project/ProjectUserInfo";

export default async function ProjectDetailScreen({
  params,
}: {
  params: { projectId: string };
}) {
  const response = await fetch(
    `${process.env.URL}/api/project/${params.projectId}`
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

  const project = data.data as project;

  return (
    <section className={`${styles.pageContainer} project_section`}>
      {/* Donate to project */}
      <div className="col-span-3">Donate to project</div>
      <div className="col-span-6 grid gap-5">
        {/* User Info */}
        <ProjectUserInfo userId={project.user_id} />
        {/* Project Card */}
        <div className="grid xl:grid-cols-2 grid-cols-1 rounded-3xl overflow-hidden bg-wheat_white">
          <Image
            src={project.image}
            alt={project.title}
            width={500}
            height={500}
            className="xl:max-h-none max-h-[300px] object-cover object-center h-full w-full"
          />
          <div className="p-5">
            <h3 className="text-base uppercase text-primary font-semibold">
              {project.subtitle}
            </h3>
            <h1 className="text-4xl font-bold leading-loose">
              {project.title}
            </h1>
            <span className="mb-5 block">
              Project Category: {project.category}
            </span>
            <p className="text-gray-700 text-sm leading-loose text-pretty">
              {project.description}
            </p>
          </div>
        </div>

        {/* Likes and Comments Section */}
        <div>Likes and Comments section</div>
      </div>

      {/* Related Projects */}
      <div className="col-span-3">Rleated Projects</div>
    </section>
  );
}
