"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  TProjectDurationSchema,
  projectDurationSchema,
} from "@/schema/project.schema";
import useProjectStore from "@/utils/store/useCreateProjectStore";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function ProjectDuration() {
  const router = useRouter();
  const { setStep, setProjectDuration, step } = useProjectStore();
  const form = useForm<TProjectDurationSchema>({
    resolver: zodResolver(projectDurationSchema),
    defaultValues: {
      launchDate: new Date(),
      projectDuration: 1,
    },
  });

  if (step === "basic") {
    router.push("/project/create");
  } else if (step === "fund") {
    router.push("/project/create/fund");
  }

  const handleSubmit = (values: TProjectDurationSchema) => {
    setProjectDuration(values);
    setStep("review");
    router.push("/project/create/review");
  };

  return (
    <section className="col-span-8 space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Launch Date</CardTitle>
              <CardDescription>
                Select the date when your project is set to launch. The selected
                date will help determine the timeline for your project&apos;s
                milestones and funding period.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="launchDate"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className="justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {form.getValues("launchDate") ? (
                              format(form.getValues("launchDate"), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            disabled={form.formState.isLoading}
                            selected={form.getValues("launchDate")}
                            onSelect={(e) => {
                              if (e) {
                                form.setValue("launchDate", e, {
                                  shouldValidate: true,
                                });
                              }
                            }}
                            title="Date of Birth"
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Project Duration</CardTitle>
              <CardDescription>
                Enter the duration of your project in days. This should be a
                numerical value indicating how long your project will be active.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="projectDuration"
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
