"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FaCreditCard } from "react-icons/fa6";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TProjectFundSchema, projectFundSchema } from "@/schema/project.schema";
import useProjectStore from "@/utils/store/useCreateProjectStore";
import { Button, buttonVariants } from "@/components/ui/button";
import { useGetPaymentAccountByUserId } from "@/services/query/useGetPaymentAccountByUserId";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

export default function FundProject() {
  const router = useRouter();
  const { setStep, setProjectFund, step } = useProjectStore();
  const session = useSession();
  const [isPending, setIsPending] = useState(false);
  const { data, isLoading, error } = useGetPaymentAccountByUserId(
    session.data?.user.id
  );
  const form = useForm<TProjectFundSchema>({
    resolver: zodResolver(projectFundSchema),
    defaultValues: {
      currentAmout: 0,
      goalAmount: 0,
      stripeAccountId: "",
    },
  });

  if (step === "basic") {
    router.push("/project/create");
  }

  const handleSubmit = (values: TProjectFundSchema) => {
    if (data) {
      setProjectFund(values);
      setStep("duration");
      router.push("/project/create/duration");
    } else {
      toast.error("Payment Account not found.", {
        description: "Please link a payment account first to create a project.",
        richColors: true,
        action: {
          label: "Close",
          onClick: () => toast.dismiss("TOAST_PROFILE_ERROR"),
        },
        duration: 10000,
        id: "TOAST_PROFILE_ERROR",
      });
    }
  };

  return (
    <section className="col-span-8 space-y-8">
      <div className="px-8 py-12 rounded-lg shadow bg-primary relative">
        <h3 className="text-white text-2xl font-semibold mb-4">
          Payment Account
        </h3>
        <p className="text-white font-normal text-base">
          Stripe Id:{" "}
          {isLoading || !data?.stripeLinked
            ? "cus_XXXXXXXXXXXXXX"
            : data?.stripeAccountId}
        </p>
        {error?.message === "ACCOUNT_NOT_FOUND" || !data?.stripeLinked ? (
          <Link
            href={"/support/paymentAccount"}
            className={cn(buttonVariants({ variant: "outline" }), "mt-4")}
          >
            Configure Payment Account
          </Link>
        ) : (
          <></>
        )}
        <FaCreditCard className="absolute inset-y-0 right-0 rotate-45 w-32 h-full text-white" />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Current Amount</CardTitle>
              <CardDescription>
                Enter the current amount of funds raised. The amount should be a
                number with up to 10 digits in total and up to 2 decimal places.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="currentAmout"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormControl>
                      <Input
                        {...field}
                        disabled={form.formState.isLoading}
                        className="border-[#cdcdcd] rounded-xl py-5"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Goal Amount</CardTitle>
              <CardDescription>
                Enter the goal amount for your project. The amount should be a
                number with up to 10 digits in total and up to 2 decimal
                places..
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="goalAmount"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormControl>
                      <Input
                        {...field}
                        disabled={form.formState.isLoading}
                        className="border-[#cdcdcd] rounded-xl py-5"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Button disabled={form.formState.isLoading}>Next</Button>
        </form>
      </Form>
    </section>
  );
}
