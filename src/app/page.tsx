import Link from "next/link";

import { borel } from "./layout";
import LatestProject from "@/components/Home/LatestProject";
import styles from "@/constant/style";
import CreateProjectCTA from "@/components/Home/CreateProjectCTA";

export default async function Home() {
  const response = await fetch(
    process.env.URL + "/api/project/latest?limit=10",
    {
      method: "GET",
    }
  );

  const project = await response.json();

  return (
    <main className={styles.pageContainer}>
      <header className="my-16 max-w-3xl mx-auto">
        <h1 className={`${borel.className} text-3xl text-center text-primary`}>
          Wall of Creativity.
        </h1>
        <p className="text-center mt-6 leading-8 font-light">
          At Fund Impact, we believe that everyone has the power to make a
          difference. Our platform connects passionate individuals with
          meaningful projects, allowing you to create, support, or donate to
          initiatives that drive real change. Whether you're launching a
          community project, supporting a global cause, or just looking to make
          an impact, Fund Impact is your gateway to transforming ideas into
          action.
        </p>
      </header>
      <section className="grid gap-5 mt-16">
        <div className="flex flex-row items-center justify-between">
          <h3 className={`${borel.className} text-3xl`}>Latest Projects</h3>
          <Link
            className="text-primary hover:underline underline-offset-2"
            href={"/"}
          >
            View More
          </Link>
        </div>
        <LatestProject payload={project.data} />
      </section>
      <CreateProjectCTA />
    </main>
  );
}
