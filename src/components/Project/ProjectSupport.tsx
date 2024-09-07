"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useSupportProject from "@/services/action/useSupportProject";
import { Button } from "../ui/button";

export default function ProjectSupport({ projectId }: { projectId: string }) {
  const [supportAmount, setSupportAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { mutate, isPending } = useSupportProject();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSupportAmount(value);

    // Validate input
    if (!/^\d+(\.\d{1,2})?$/.test(value) || parseFloat(value) <= 0) {
      setError("Please enter a valid amount greater than $0.00.");
    } else {
      setError("");
    }
  };
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button disabled={isPending}>Support Project</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-primary">Support Amount</DialogTitle>
            <DialogDescription>
              Enter support amount in dollars:
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-stretch">
            <Input
              id="support"
              name="support"
              type="text"
              className="w-full"
              placeholder="20.00 $"
              value={supportAmount}
              onChange={handleInputChange}
            />
            <Button
              disabled={!!error || isPending}
              onClick={() => {
                mutate(
                  {
                    projectId,
                    supportAmount: Number(supportAmount),
                  },
                  {
                    onError: (error) => {
                      toast.error("Error!", {
                        description:
                          error.message ??
                          "Something went wrong. Please try again.",
                        action: {
                          label: "Close",
                          onClick: () => toast.dismiss("SUPPORT_ERROR"),
                        },
                        duration: 10000,
                        id: "SUPPORT_ERROR",
                      });
                    },
                  }
                );
              }}
              className="ml-2"
            >
              Support
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" className="bg-gray-900">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
