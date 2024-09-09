"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { FaTrashCan } from "react-icons/fa6";
import { useRouter } from "next/navigation";

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
import { Textarea } from "@/components/ui/textarea";
import { PROJECT_CATEGORIES } from "@/schema/project.schema";
import useProjectStore from "@/utils/store/useCreateProjectStore";
import {
  TProjectBasicsSchema,
  projectBasicsSchema,
} from "@/schema/project.client.schema";

export default function CreateProject() {
  const router = useRouter();
  const { setStep, setProjectBasics } = useProjectStore();
  const [projectImage, setProjectImage] = useState<File>();
  const form = useForm<TProjectBasicsSchema>({
    resolver: zodResolver(projectBasicsSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
    },
  });

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      form.setValue("image", e.target.files[0]);
      setProjectImage(form.getValues("image"));
    }
  }

  const handleSubmit = (values: TProjectBasicsSchema) => {
    setProjectBasics(values);
    setStep("fund");
    router.push("/project/create/fund");
  };

  return (
    <section className="col-span-10 grid grid-cols-8 gap-6">
      {projectImage ? (
        <div className="relative col-span-3">
          <Image
            src={URL.createObjectURL(projectImage)}
            alt="Project Image"
            width={500}
            height={700}
            className="rounded-xl object-cover max-h-[570px]"
          />
          <span
            onClick={() => {
              form.resetField("image");
              setProjectImage(undefined);
            }}
            className="bg-primary cursor-pointer text-white w-30 h-30 p-4 rounded-full hover:shadow absolute top-4 left-4"
          >
            <FaTrashCan />
          </span>
        </div>
      ) : (
        <label className="col-span-3 border border-dashed rounded-xl border-gray-400 flex flex-col items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="200px"
            height="200px"
            className="text-gray-700"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="1.5"
            >
              <path
                stroke-linejoin="round"
                d="M21.25 13V8.5a5 5 0 0 0-5-5h-8.5a5 5 0 0 0-5 5v7a5 5 0 0 0 5 5h6.26"
              ></path>
              <path
                stroke-linejoin="round"
                d="m3.01 17l2.74-3.2a2.2 2.2 0 0 1 2.77-.27a2.2 2.2 0 0 0 2.77-.27l2.33-2.33a4 4 0 0 1 5.16-.43l2.47 1.91M8.01 10.17a1.66 1.66 0 1 0-.02-3.32a1.66 1.66 0 0 0 .02 3.32"
              ></path>
              <path stroke-miterlimit="10" d="M18.707 15v5"></path>
              <path
                stroke-linejoin="round"
                d="m21 17.105l-1.967-1.967a.458.458 0 0 0-.652 0l-1.967 1.967"
              ></path>
            </g>
          </svg>
          {form.getFieldState("image").error ? (
            <p className="text-center text-red-500">
              {form.getFieldState("image").error?.message}
            </p>
          ) : (
            <p className="text-center text-gray-700">
              Choose a file or drag and drop here.
            </p>
          )}
          <input
            disabled={form.formState.isLoading}
            type="file"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      )}
      <div className="col-span-5">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={form.formState.isLoading}
                      className="border-[#cdcdcd] rounded-xl py-5"
                      placeholder="Enter project title here."
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={form.formState.isLoading}
                      className="border-[#cdcdcd] rounded-xl py-5"
                      placeholder="Enter subtitle title here."
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Select project Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={form.formState.isLoading}
                    {...field}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full border-[#cdcdcd] rounded-xl py-5">
                        <SelectValue placeholder="Select one the project categories" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-[#cdcdcd]">
                      {PROJECT_CATEGORIES.map((category) => (
                        <SelectItem value={category} key={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={form.formState.isLoading}
                      className="min-h-[150px] border-[#cdcdcd] rounded-xl"
                      placeholder="Add a detailed description here"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={form.formState.isLoading}>Next</Button>
          </form>
        </Form>
      </div>
    </section>
  );
}
