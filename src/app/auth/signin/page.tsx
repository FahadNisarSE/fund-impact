"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

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
import { TloginUserSchema, loginUserSchema } from "@/schema/auth.schema";
import useSignIn from "@/services/action/useSignIn";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "../../../../route";

export default function SignIn() {
  const { mutate, isPending, error } = useSignIn();
  const [isUnverified, setIsUnverified] = useState(false);
  const form = useForm<TloginUserSchema>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: TloginUserSchema) {
    const { email, password } = values;
    mutate(
      { email, password },
      {
        onSuccess: (data) => {
          if (data?.type && data.type === "UNVERIFIED") {
            setIsUnverified(true);
          } else {
            window.location.href = "/profile";
          }
        },
      }
    );
  }

  return (
    <div className="w-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-6 text-center mb-4">
            <h1 className="text-3xl font-bold">Login to you account.</h1>
            <Image
              src="/logo.svg"
              alt="Fund Impact"
              width={200}
              height={100}
              className="mx-auto"
            />
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <div className="flex items-center">
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Link
                          href="/auth/reset"
                          className="ml-auto inline-block text-sm underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="*********"
                          type="password"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <ErrorCard message={error?.message} />
                <SuccessCard
                  message={
                    isUnverified
                      ? "We have sent an verification email. Please verifiy your email."
                      : ""
                  }
                />
                <Button disabled={isPending} type="submit">
                  Sign in
                </Button>
              </form>
            </Form>
            <Button
              disabled={isPending}
              onClick={() => {
                signIn("google", {
                  callbackUrl: DEFAULT_LOGIN_REDIRECT,
                });
              }}
              variant="outline"
              className="w-full"
            >
              Login with Google
            </Button>
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
