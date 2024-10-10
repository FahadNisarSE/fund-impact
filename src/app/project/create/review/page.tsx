"use client";

import { useRouter } from "next/navigation";
import { Moderation } from "openai/resources/moderations.mjs";
import { useState } from "react";
import { FiLoader } from "react-icons/fi";
import { toast } from "sonner";
import { RiArrowDropRightLine } from "react-icons/ri";

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
  const [moderation, setModeration] = useState<Moderation>({
    flagged: true,
    categories: {
      sexual: false,
      hate: false,
      harassment: false,
      "self-harm": false,
      "sexual/minors": false,
      "hate/threatening": false,
      "violence/graphic": false,
      "self-harm/intent": false,
      "self-harm/instructions": false,
      "harassment/threatening": true,
      violence: true,
    },
    category_scores: {
      sexual: 1.2282071e-6,
      hate: 0.010696256,
      harassment: 0.29842457,
      "self-harm": 1.5236925e-8,
      "sexual/minors": 5.7246268e-8,
      "hate/threatening": 0.0060676364,
      "violence/graphic": 4.435014e-6,
      "self-harm/intent": 8.098441e-10,
      "self-harm/instructions": 2.8498655e-11,
      "harassment/threatening": 0.63055265,
      violence: 0.99011886,
    },
  });

  // if (step === "basic") {
  //   router.push("/project/create");
  // } else if (step === "fund") {
  //   router.push("/project/create/fund");
  // } else if (step === "duration") {
  //   router.push("/project/create/duration");
  // }

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
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Moderation Alert
            </AlertDialogTitle>
            <AlertDialogDescription>
              The post contains content that violates moderation guidelines.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {moderation && (
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
