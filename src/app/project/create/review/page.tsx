"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import useCreateNewProject from "@/services/action/useCreateNewProject";
import useProjectStore from "@/utils/store/useCreateProjectStore";
import { FiLoader } from "react-icons/fi";

export default function Review() {
  const router = useRouter();
  const { step, projectBasics, projectFund, projectDuration, reset } =
    useProjectStore();
  const { isPending, mutate, error } = useCreateNewProject();

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
    </section>
  );
}
