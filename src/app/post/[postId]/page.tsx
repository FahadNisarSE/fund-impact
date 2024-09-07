import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import styles from "@/constant/style";
import { posts, user } from "../../../../db/types";
import PostUserInfo from "@/components/Posts/PostUserInfo";
import PostLikeAndComment from "@/components/Posts/PostLikeAndComment";
import PostComments from "@/components/Posts/PostComments";
import RelatedPosts from "@/components/Posts/RelatedPosts";

export const revalidate = 3600000;

export default async function PostDetailPage({
  params,
}: {
  params: { postId: string };
}) {
  const response = await fetch(
    `${process.env.URL}/api/post/detail/${params.postId}`
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

  const { posts, user } = data.data as {
    posts: posts;
    user: user;
  };

  return (
    <section className={`${styles.pageContainer} post_section`}>
      <div className="col-span-8 flex flex-col gap-5">
        {/* User Info */}
        <PostUserInfo userId={posts.userId} post={posts} user={user} />

        {/* Post Card */}
        <div className="grid xl:grid-cols-2 grid-cols-1 rounded-3xl overflow-hidden bg-wheat_white xl:max-h-[600px]">
          <Image
            src={posts.image}
            alt={posts.title}
            width={500}
            height={500}
            className="xl:max-h-none max-h-[300px] object-cover object-center h-full w-full"
          />
          <div className="p-5">
            <h1 className="text-3xl font-bold text-pretty my-2">
              {posts.title}
            </h1>

            <p className="text-gray-700 text-sm leading-loose text-pretty pt-4 mt-4 border-t">
              {posts.content}
            </p>
          </div>
        </div>

        {/* Likes and Comments Section */}
        <PostLikeAndComment postId={posts.postId!} />

        {/* POST comments */}
        <PostComments postId={posts.postId!} />
      </div>

      {/* Related Posts */}
      <div className="col-span-4">
        <h3 className="text-lg font-semibold">Related Posts</h3>
        <RelatedPosts postId={posts.postId!} />
      </div>
    </section>
  );
}
