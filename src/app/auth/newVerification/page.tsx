"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { CgSpinner } from "react-icons/cg";

import ErrorCard from "@/components/ErrorCard";
import ErrorCube from "@/components/ErrorCube";
import SuccessCard from "@/components/SuccessCard";
import SuccessCube from "@/components/SuccessCube";
import { buttonVariants } from "@/components/ui/button";
import styles from "@/constant/style";
import useEmailVerification from "@/services/action/useEmailVerification";

export default function NewVerification() {
  const searchParam = useSearchParams();
  const token = searchParam.get("token");
  const { mutate, isPending, error } = useEmailVerification();
  const router = useRouter();

  useEffect(() => {
    mutate(
      { token },
      {
        onSuccess: () => {
          router.push("/auth/signin");
        },
      }
    );
  }, []);

  return (
    <section className={`${styles.projectForm}`}>
      <div className="mx-auto grid w-[350px] gap-6 min-h-[40svh] border p-4 rounded-lg">
        <h3 className="text-xl text-center text-primary font-semibold">
          Email Verification
        </h3>
        <div className="flex flex-col gap-4 items-center w-full justify-center">
          {isPending ? (
            <>
              <CgSpinner className="w-20 h-20 mx-auto animate-spin text-primary duration-700" />
              <p className="text-gray-700">Verifying your email.</p>
            </>
          ) : (
            <>
              {error ? (
                <>
                  <ErrorCube />
                  <div className="mt-16" />
                  <ErrorCard message={error.message ?? ""} />
                </>
              ) : (
                <>
                  <SuccessCube />
                  <div className="mt-16" />
                  <SuccessCard message={"Email verified successfully"} />
                  <Link href={"/auth/signin"} className={buttonVariants()}>
                    Sign In
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
