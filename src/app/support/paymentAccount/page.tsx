import { auth } from "@/../auth";
import {
  createPaymentAccount,
  createStripeAccountLink,
  getStripeDashboardLink,
  paymentAccountExists,
} from "@/action/stripe/stripe";
import { Button } from "@/components/ui/button";
import styles from "@/constant/style";

export default async function PaymentAccount() {
  const session = await auth();
  let paymentAccount;
  paymentAccount = await paymentAccountExists(session?.user?.id!);
  if (!paymentAccount) {
    paymentAccount = await createPaymentAccount(
      session?.user.id!,
      session?.user?.email!
    );
  }

  return (
    <main className={`${styles.pageContainer} flex flex-col`}>
      <header className="space-y-4">
        <h1 className="text-3xl font-bold">Payment Account</h1>
        <p className="text-gray-600">
          Find all you account details here in one place.
        </p>
      </header>

      <section className="w-full flex-1 flex flex-col items-center justify-center gap-6">
        <img
          src="/payment.png"
          alt="Payments"
          className="max-w-[250px] w-full object-contain"
        />
        {paymentAccount?.stripeLinked ? (
          <form action={getStripeDashboardLink}>
            <Button size={"lg"}>Stripe Dashboard</Button>
          </form>
        ) : (
          <form action={createStripeAccountLink}>
            <Button size={"lg"}>Link you Payment Account</Button>
          </form>
        )}
      </section>
    </main>
  );
}
