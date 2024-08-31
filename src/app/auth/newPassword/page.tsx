"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { NewPasswordSchema, TNewPasswordSchema } from "@/schema/auth.schema";
import useNewPassword from "@/services/action/useNewPassword";
import { useSearchParams } from "next/navigation";

export default function NewPassword() {
  const searchParam = useSearchParams();
  const token = searchParam.get("token");
  const router = useRouter();

  const { mutate, isPending, isSuccess, error } = useNewPassword();
  const form = useForm<TNewPasswordSchema>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  async function onSubmit(values: TNewPasswordSchema) {
    mutate(
      { values, token },
      {
        onSuccess: (data) => {
          router.push("/auth/signIn");
        },
      }
    );
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
            <h1 className="text-3xl font-bold">Change your password.</h1>
          </div>
          <div className="mx-auto grid w-[350px] gap-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4"
              >
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
                <ErrorCard message={error ? error.message : ""} />
                <SuccessCard
                  message={isSuccess ? "You have changed you password." : ""}
                />
                <Button disabled={isPending} type="submit">
                  Reset Password
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
