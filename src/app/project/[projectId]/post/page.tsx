"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaTrashCan } from "react-icons/fa6";
import { toast } from "sonner";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import styles from "@/constant/style";
import {
  TPostClientSchema,
  postClientSchema,
} from "@/schema/post.schema.client";
import useCreateProjectPost from "@/services/action/useCreateProjectPost";
import useGetProjectById from "@/services/query/useGetProjectById";
import { useParams, useRouter } from "next/navigation";
import { Moderation } from "openai/resources/moderations.mjs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ProjectPost() {
  const [postImage, setPostImage] = useState<File>();
  const { projectId } = useParams();
  const { isLoading, error, data } = useGetProjectById(
    typeof projectId === "string" ? projectId : projectId[0]
  );
  const {
    mutate: savePost,
    isPending,
    error: postError,
  } = useCreateProjectPost();
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [moderation, setModeration] = useState<Moderation>();

  const form = useForm<TPostClientSchema>({
    resolver: zodResolver(postClientSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      form.setValue("image", e.target.files[0]);
      setPostImage(form.getValues("image"));
    }
  }

  function handleSubmit(values: TPostClientSchema) {
    savePost(
      {
        info: values,
        projectId: projectId as string,
      },
      {
        onError: (error) => {
          console.log("On Error Callback: ", error);
          if (error.name === "MODERATION") {
            console.log("Error: ", error);
            // @ts-ignore
            setModeration(error.moderationResults);
            setOpen(true);
            return;
          }
          toast.error("Error!", {
            description:
              error.message ?? "Something went wrong. Please try again.",
            action: {
              label: "Close",
              onClick: () => toast.dismiss("POST_ERROR"),
            },
            duration: 10000,
            id: "POST_ERROR",
          });
        },
        onSuccess: (data) => {
          toast.success("Post Uploaded!", {
            description: "Post uploaded successfully.",
            action: {
              label: "Close",
              onClick: () => toast.dismiss("POST_SUCCESS"),
            },
            duration: 10000,
            id: "POST_SUCCESS",
          });
          router.push(`/post/${data.postId}`);
        },
      }
    );
  }

  return (
    <main className={`${styles.pageContainer} grid grid-cols-8 gap-6`}>
      {postImage ? (
        <div className="relative col-span-3">
          <Image
            src={URL.createObjectURL(postImage)}
            alt="Project Image"
            width={500}
            height={700}
            className="rounded-xl max-h-[570px] object-cover"
          />
          <span
            onClick={() => {
              setPostImage(undefined);
              form.resetField("image");
            }}
            className="bg-primary cursor-pointer text-white w-30 h-30 p-4 rounded-full hover:shadow absolute top-4 left-4"
          >
            <FaTrashCan />
          </span>
        </div>
      ) : (
        <label className="col-span-3 border border-dashed rounded-xl border-gray-400 flex flex-col items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="150px"
            height="150px"
            className="text-gray-700"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="1.5"
            >
              <path
                stroke-linejoin="round"
                d="M21.25 13V8.5a5 5 0 0 0-5-5h-8.5a5 5 0 0 0-5 5v7a5 5 0 0 0 5 5h6.26"
              ></path>
              <path
                stroke-linejoin="round"
                d="m3.01 17l2.74-3.2a2.2 2.2 0 0 1 2.77-.27a2.2 2.2 0 0 0 2.77-.27l2.33-2.33a4 4 0 0 1 5.16-.43l2.47 1.91M8.01 10.17a1.66 1.66 0 1 0-.02-3.32a1.66 1.66 0 0 0 .02 3.32"
              ></path>
              <path stroke-miterlimit="10" d="M18.707 15v5"></path>
              <path
                stroke-linejoin="round"
                d="m21 17.105l-1.967-1.967a.458.458 0 0 0-.652 0l-1.967 1.967"
              ></path>
            </g>
          </svg>
          {form.getFieldState("image").error ? (
            <p className="text-center text-red-500">
              {form.getFieldState("image").error?.message}
            </p>
          ) : (
            <p className="text-center text-gray-700">
              Choose a file or drag and drop here.
            </p>
          )}
          <input
            disabled={form.formState.isLoading}
            type="file"
            accept=".jpg, .jpeg, .png"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      )}
      <div className="col-span-5 flex flex-col justify-between">
        {/* Project Details */}
        {isLoading ? (
          <div className="w-full mb-8 p-8 flex items-center gap-8 border border-primary rounded-md border-dashed">
            <div>
              <Skeleton className="w-[150px] h-[150px] rounded-md" />
            </div>
            <div className="flex-1">
              <Skeleton className="w-[150px] h-[20px] rounded-full" />
              <Skeleton className="w-full h-[20px] rounded-full mt-8 mb-4" />
              <Skeleton className="w-full h-[20px] rounded-full" />
            </div>
          </div>
        ) : error || !data ? (
          <div className="w-full mb-8 p-8 flex flex-col items-center gap-8 border border-primary rounded-md border-dashed">
            <div>
              <h3 className="text-destructive">Something Went wrong</h3>
            </div>
            <div className="flex-1">
              <p>{error?.message}</p>
            </div>
          </div>
        ) : (
          <div className="w-full mb-8 p-8 flex items-center gap-8 border border-primary rounded-md border-dashed">
            <div>
              <Image
                width={150}
                height={150}
                src={data.image}
                alt={data.title}
                className="w-[150px] h-[150px] rounded-md object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{data.title}</h3>
              <p className="mt-4 text-foreground text-sm text-gray-700 font-light leading-relaxed text-pretty">
                {data.description.length > 200
                  ? data.description.slice(0, 200) + "..."
                  : data.description}
              </p>
            </div>
          </div>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col flex-1 gap-8"
          >
            <div className="grid gap-3">
              <span className="text-sm">Project Name</span>
              <div className="border-[#cdcdcd] rounded-xl px-2 py-5 text-sm border pointer-events-none">
                {data?.title}
              </div>
            </div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={form.formState.isLoading}
                      className="py-5 border-[#cdcdcd] rounded-xl"
                      placeholder="Enter post title here."
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={form.formState.isLoading}
                      className="min-h-[150px] border-[#cdcdcd] rounded-xl"
                      placeholder="Add a post description here"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-auto" disabled={form.formState.isLoading}>
              {isPending ? <Loader /> : "Submit Post"}
            </Button>
          </form>
        </Form>
      </div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          {moderation ? (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-destructive">
                  Moderation Alert
                </AlertDialogTitle>
                <AlertDialogDescription>
                  The post contains content that violates moderation guidelines.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div>
                <p>
                  <strong>Flagged Categories:</strong>
                </p>
                <ul className="space-y-1 my-2">
                  {Object.keys(moderation.categories).map(
                    (category) =>
                      // @ts-ignore
                      moderation.categories[category] && (
                        <li className="capitalize" key={category}>
                          {category.replace("/", " ")}
                        </li>
                      )
                  )}
                </ul>

                <p>
                  <strong>Scores:</strong>
                </p>
                <ol className="list-inside list-decimal space-y-1 mt-2">
                  {Object.keys(moderation.category_scores).map(
                    (score) =>
                      // @ts-ignore
                      moderation.categories[score] && (
                        <li key={score} className="capitalize">
                          {score.replace("/", " ")}:{" "}
                          {
                            // @ts-ignore
                            moderation.category_scores[score].toFixed(2)
                          }
                        </li>
                      )
                  )}
                </ol>
              </div>
            </>
          ) : (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-destructive">
                  Moderation Guidelines
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Your project or post follow these guidelines.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="alert alert-warning" role="alert">
                <h4 className="alert-heading">Important Guidelines!</h4>
                <p>Your project should adhere to the following guidelines:</p>
                <ul>
                  <li>Avoid violence or graphic content.</li>
                  <li>No harassment or threatening content.</li>
                  <li>No hate speech or inappropriate language.</li>
                  <li>No self-harm or dangerous instructions.</li>
                  <li>Ensure content is respectful and safe for all users.</li>
                </ul>
                <hr />
                <p className="mb-0">
                  Please review your content before submission to ensure it
                  aligns with the guidelines.
                </p>
              </div>
            </>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => setOpen(false)}>
              Acknowledge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
