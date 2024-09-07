import SuccessCube from "@/components/SuccessCube";
import { buttonVariants } from "@/components/ui/button";
import styles from "@/constant/style";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function SupportSuccess() {
  return (
    <section
      className={cn(
        styles.pageContainer,
        "flex flex-col items-center justify-center gap-5"
      )}
    >
      <SuccessCube />
      <h3 className="text-3xl font-semibold mt-10">Payment Successful!</h3>
      <p className="text-center text-lg mt-5 text-pretty max-w-md text-gray-600">
        "Investing in the future is more than just a transaction—it's a
        commitment to shaping a better world. Thank you for being part of the
        change."
      </p>

      <Link href={"/"} className={buttonVariants()}>
        Back to home
      </Link>
    </section>
  );
}
