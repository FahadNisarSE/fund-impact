"use client";

import { useRouter } from "next/navigation";
import { Moderation } from "openai/resources/moderations.mjs";
import { useState } from "react";
import { FiLoader } from "react-icons/fi";
import { toast } from "sonner";

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
import { Button } from "@/components/ui/button";
import useCreateNewProject from "@/services/action/useCreateNewProject";
import useProjectStore from "@/utils/store/useCreateProjectStore";

export default function Review() {
  const router = useRouter();
  const { step, projectBasics, projectFund, projectDuration, reset } =
    useProjectStore();
  const { isPending, mutate, error } = useCreateNewProject();
  const [open, setOpen] = useState(true);
  const [moderation, setModeration] = useState<Moderation>();

  if (step === "basic") {
    router.push("/project/create");
  } else if (step === "fund") {
    router.push("/project/create/fund");
  } else if (step === "duration") {
    router.push("/project/create/duration");
  }

  async function saveProject() {
    mutate(
      {
        projectDuration,
        projectBasics,
        projectFund,
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
              error.message ?? "Somthing went wrong. Please try again.",
            action: {
              label: "Close",
              onClick: () => toast.dismiss("PROJECT_ERROR"),
            },
            duration: 10000,
            id: "PROJECT_ERROR",
          });
        },
        onSuccess: () => {
          toast.success("Project Created Successfully!", {
            description: "You will be navigated to project screen.",
            action: {
              label: "Close",
              onClick: () => toast.dismiss("PROJECT_SUCCESS"),
            },
            duration: 10000,
            id: "PROJECT_SUCCESS",
          });
          reset();
        },
      }
    );
  }

  return (
    <section className="col-span-10 grid grid-cols-8 gap-6">
      <div className="relative col-span-3">
        {projectBasics.image && (
          <img
            src={URL.createObjectURL(projectBasics.image)}
            alt="Project Image"
            width={500}
            height={700}
            className="rounded-xl object-cover max-h-svh h-full"
          />
        )}
      </div>
      <div className="col-span-5 space-y-6 flex flex-col">
        <div className="relative flex flex-col gap-4 pb-5 border-b">
          <h1 className="text-3xl font-bold">{projectBasics.title}</h1>
          <h3 className="text-lg font-medium text-primary">
            {projectBasics.subtitle}
          </h3>
          <p className="font-light">{projectBasics.description}</p>
          <span className="font-medium">
            <strong className="font-bold text-primary">Category: </strong>{" "}
            {projectBasics.category}
          </span>
        </div>

        <div className="flex flex-col gap-3 pb-5 border-b">
          <span className="font-light">
            <strong className="font-semibold">Current Amount:</strong>{" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(projectFund.currentAmout ?? 0)}
          </span>
          <span className="font-light">
            <strong className="font-semibold">Goal Amount:</strong>{" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(projectFund.goalAmount ?? 0)}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-light">
            <strong className="font-semibold">Start Date:</strong>{" "}
            {projectDuration.launchDate?.toString()}
          </span>
          <span className="font-light">
            <strong className="font-semibold">Project Duration:</strong>{" "}
            {projectDuration.projectDuration}
            days
          </span>
        </div>
        <div className="flex-1 flex items-end">
          <Button
            className="w-full text-center"
            onClick={saveProject}
            disabled={isPending}
          >
            {isPending ? <FiLoader className="animate-spin" /> : "Save Project"}
          </Button>
        </div>
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
    </section>
  );
}
