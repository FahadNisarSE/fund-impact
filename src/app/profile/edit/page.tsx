"use client";

import { TProfileSchema, profileSchema } from "@/schema/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CiImageOff } from "react-icons/ci";
import { LuImagePlus } from "react-icons/lu";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FiUser } from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import style from "@/constant/style";
import useUpdateProfile from "@/services/action/useUpdateProfile";
import { useGetUserById } from "@/services/query/useGetUserById";
import { queryClient } from "@/utils/Providers";

export default function EditProfile() {
  const { data: session } = useSession();
  const { data, isLoading, error, isSuccess, refetch } = useGetUserById(
    session?.user.id
  );
  const { mutate, isPending } = useUpdateProfile();

  const [profileImage, setprofileImage] = useState<File>();
  const form = useForm<TProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: "",
      name: "",
      bio: "",
      dateOfBirth: new Date(),
      image: "",
    },
    reValidateMode: "onSubmit",
  });

  // Fillout the form values after fetching user details from backend
  useEffect(() => {
    if (isSuccess && data) {
      form.reset({
        name: data?.name ?? "",
        email: data?.email ?? "",
        bio: data?.bio ?? "",
        dateOfBirth: data.dateOfBirth ?? new Date(),
        image: data?.image ?? "",
      });
    }
  }, [isSuccess]);

  async function onSubmit(values: TProfileSchema) {
    mutate(
      {
        payload: { ...values, id: data?.id! },
        image: profileImage,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["get_user_by_id", data?.id],
          });
          refetch();
          setprofileImage(undefined);
        },
        onError: (error) => {
          console.log("Error: ", error);
        },
      }
    );
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setprofileImage(file);
    }
  }

  return (
    <main className={style.pageContainer}>
      <header className="rounded-3xl bg-primary my-5 relative">
        <div className="p-8">
          <div>
            <h3 className="text-3xl font-medium text-white mb-6">
              Edit you profile
            </h3>
            <p className="text-sm text-muted mb-4">
              This is how others will see you on the site.
            </p>
          </div>
          <Button variant={"outline"} size={"lg"}>
            <Link
              href="/profile"
              className="flex flex-row items-center gap-x-2 cursor-pointer"
            >
              <FiUser className="w-5 h-5" /> Profile
            </Link>
          </Button>
        </div>
        <img
          src="/bg_stars.svg"
          alt="star background"
          className="absolute right-0 top-0 bottom-0 h-full"
        />
      </header>

      <div className="mx-auto max-w-[600px] my-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Profile Image</FormLabel>
                  <div className="border border-gray-500 border-dashed rounded-md p-8 min-h-44 flex flex-col gap-4 items-center justify-center">
                    {profileImage ? (
                      <Image
                        src={URL.createObjectURL(profileImage)}
                        alt="Profile Image"
                        width={200}
                        height={200}
                      />
                    ) : data?.image ? (
                      <Image
                        src={data.image}
                        alt={data?.name ?? "User Image"}
                        width={200}
                        height={200}
                      />
                    ) : (
                      <>
                        <CiImageOff className="w-10 h-10 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          No profile image available
                        </p>
                      </>
                    )}
                  </div>
                  <label>
                    <input
                      disabled={isPending}
                      className="hidden"
                      type="file"
                      onChange={handleImageChange}
                    />
                    <div className="flex mt-2 cursor-pointer items-center justify-center gap-6 border border-gray-500 border-dashed rounded p-4 py-2">
                      <p className="text-sm text-muted-foreground">
                        Upload a profile image
                      </p>
                      <LuImagePlus className="text-muted-foreground" />
                    </div>
                  </label>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder="John Doe"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={true}
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
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.getValues("dateOfBirth") ? (
                          format(form.getValues("dateOfBirth"), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        disabled={isPending}
                        selected={form.getValues("dateOfBirth")}
                        onSelect={(e) => {
                          if (e) {
                            form.setValue("dateOfBirth", e, {
                              shouldValidate: true,
                            });
                          }
                        }}
                        title="Date of Birth"
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isPending}
                      {...field}
                      placeholder="Enter you bio"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isPending}
              type="submit"
              size={"lg"}
              className="flex items-center justify-center"
            >
              {isPending ? (
                <ImSpinner8 className="w-5 h-5 text-white animate-spin" />
              ) : (
                "Update Your Profile"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
