"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TUserSignUpSchema,
  UserRole,
  userSignUpSchema,
} from "@/schema/auth.schema";
import useSignUp from "@/services/action/useSignUp";
import { DEFAULT_LOGIN_REDIRECT } from "../../../../route";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const { mutate, isPending, isSuccess, error } = useSignUp();
  const router = useRouter();
  const form = useForm<TUserSignUpSchema>({
    resolver: zodResolver(userSignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      userRole: UserRole.Supporter,
    },
  });

  async function onSubmit(values: TUserSignUpSchema) {
    mutate(values, {
      onSuccess: (data) => {
        console.log("Sign up successfull!",)
      }
    });
  }

  return (
    <div className="w-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-6 text-center mb-4">
            <h1 className="text-3xl font-bold">Register your account.</h1>
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
                      <FormLabel htmlFor="password">Password</FormLabel>

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
                <FormField
                  control={form.control}
                  name="userRole"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Account Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isPending}
                        {...field}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select an account type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Creator">Creator</SelectItem>
                          <SelectItem value="Supporter">Supporter</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <ErrorCard message={error ? error.message : ""} />
                <SuccessCard
                  message={
                    isSuccess
                      ? "We have a verfication email to you. Please verify email to siginin."
                      : ""
                  }
                />
                <Button disabled={isPending} type="submit">
                  Sign up
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
              Sign up with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/signin" className="underline">
              Sign in
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
