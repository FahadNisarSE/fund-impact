import Link from "next/link";

import ErrorCube from "@/components/ErrorCube";
import { buttonVariants } from "@/components/ui/button";
import styles from "@/constant/style";
import { cn } from "@/lib/utils";

export default function SupportError() {
  return (
    <section
      className={cn(
        styles.pageContainer,
        "flex flex-col items-center justify-center gap-5"
      )}
    >
      <ErrorCube />
      <h3 className="text-3xl font-semibold mt-10 text-red-500">Payment Failed!</h3>
      <p className="text-center mt-5 text-pretty max-w-md text-gray-600">
        We're sorry, but something went wrong with your payment. Please try
        again or contact support for assistance.
      </p>
      <p className="text-center mt-1 text-pretty max-w-md text-gray-600">
        "Every setback is a setup for a comeback. Don't give up—your support is
        crucial in making a difference."
      </p>

      <Link href={"/"} className={buttonVariants()}>
        Back to home
      </Link>
    </section>
  );
}
