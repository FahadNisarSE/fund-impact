"use client";

import styles from "@/constant/style";
import { useSearchParams } from "next/navigation";
import Error from "@/components/Error";

export default function AuthError() {
  const searchParams = useSearchParams();

  return (
    <main
      className={`${styles.pageContainer} flex flex-col items-center justify-center`}
    >
      <Error
        message={
          searchParams.getAll("error").length
            ? searchParams.getAll("error")[0]
            : "Somethin went wrong. Please try again."
        }
        link="/auth/signin"
        linkMessage="Go back to Login"
      />
    </main>
  );
}
