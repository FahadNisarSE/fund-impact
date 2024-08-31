"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import ErrorCard from "@/components/ErrorCard";
import SuccessCard from "@/components/SuccessCard";
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
import {
  ResetPasswordSchema,
  TresetPasswordSchema,
} from "@/schema/auth.schema";
import useResetPassword from "@/services/action/useResetPassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DEFAULT_LOGIN_REDIRECT } from "@/../route";

export default function Reset() {
  const { mutate, isPending, error, isSuccess } = useResetPassword();
  const form = useForm<TresetPasswordSchema>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: TresetPasswordSchema) {
    mutate({ email: values.email });
  }

  return (
    <div className="w-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-6 text-center mb-4">
            <Image
              src="/logo.svg"
              alt="Fund Impact"
              width={200}
              height={100}
              className="mx-auto"
            />
            <h1 className="text-3xl font-bold">Forgot you password.</h1>
          </div>
          <div className="mx-auto grid w-[350px] gap-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="john.doe@example.com"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <ErrorCard message={error ? error.message : ""} />
                <SuccessCard
                  message={
                    isSuccess
                      ? "Verification email has been sent successfully."
                      : ""
                  }
                />
                <Button disabled={isPending} type="submit">
                  Forgot Password
                </Button>
              </form>
            </Form>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block lg:h-screen lg:overflow-hidden">
        <Image
          src="/login_banner.jpg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
