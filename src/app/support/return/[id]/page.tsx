import Link from "next/link";
import { RiVerifiedBadgeFill } from "react-icons/ri";

import { Button, buttonVariants } from "@/components/ui/button";
import styles from "@/constant/style";
import { cn } from "@/lib/utils";

export default function ReturnUrlStripe() {
  return (
    <main
      className={`${styles.pageContainer} flex flex-col items-center justify-center`}
    >
      <section className="p-8 bg-white shadow-lg rounded-2xl max-w-[400px] flex flex-col items-center gap-6 ">
        <RiVerifiedBadgeFill className="w-16 h-16 text-primary" />
        <h1 className="text-2xl font-bold text-center">Congratulations!</h1>
        <p className="text-gray-600 text-center font-light">
          Your bank account has been linked successfully. Now you can recieve
          payments directly in you bank accounts.
        </p>
        <Link
          href={"/"}
          className={cn(buttonVariants({ size: "lg" }), "w-full")}
        >
          Go back to Home
        </Link>
      </section>
    </main>
  );
}
