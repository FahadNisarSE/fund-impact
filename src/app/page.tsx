import Link from "next/link";

import Footer from "@/components/Footer";
import CreateProjectCTA from "@/components/Home/CreateProjectCTA";
import Features from "@/components/Home/Features";
import LatestPosts from "@/components/Home/LatestPosts";
import LatestProject from "@/components/Home/LatestProject";
import styles from "@/constant/style";
import { posts, project } from "../../db/types";
import { borel } from "./layout";

export const revalidate = 60;

export default async function Home() {
  const promise1 = fetch(process.env.URL + "/api/project/latest?limit=10");
  const promise2 = fetch(process.env.URL + "/api/post/latest?limit=10");

  const [response1, response2] = await Promise.all([promise1, promise2]);

  const projects = (await response1.json()) as {
    code: number;
    message: string;
    data: project[];
  };
  const _posts = (await response2.json()) as {
    code: number;
    message: string;
    data: posts[];
  };

  return (
    <>
      <main className={styles.pageContainer}>
        <header className="my-16 max-w-3xl mx-auto">
          <h1
            className={`${borel.className} text-3xl text-center text-primary`}
          >
            Wall of Creativity.
          </h1>
          <p className="text-center mt-6 leading-8 font-light">
            At Fund Impact, we believe that everyone has the power to make a
            difference. Our platform connects passionate individuals with
            meaningful projects, allowing you to create, support, or donate to
            initiatives that drive real change. Whether you're launching a
            community project, supporting a global cause, or just looking to
            make an impact, Fund Impact is your gateway to transforming ideas
            into action.
          </p>
        </header>
        <section className="grid gap-5 mt-16">
          <div className="flex flex-row items-center justify-between">
            <h3 className={`${borel.className} text-3xl`}>Latest Projects</h3>
            <Link
              className="text-primary hover:underline underline-offset-2"
              href={"/project/feed"}
            >
              View More
            </Link>
          </div>
          <LatestProject payload={projects.data} />
        </section>
        <CreateProjectCTA />
        <section className="grid gap-5 mt-16">
          <div className="flex flex-row items-center justify-between">
            <h3 className={`${borel.className} text-3xl`}>Latest Posts</h3>
            <Link
              className="text-primary hover:underline underline-offset-2"
              href={"/post/feed"}
            >
              View More
            </Link>
          </div>
          <LatestPosts payload={_posts.data} />
        </section>
        <Features />
      </main>
      <Footer />
    </>
  );
}
