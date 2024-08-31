import { useQuery } from "@tanstack/react-query";
import { paymentAcccount } from "@/../../db/types";

const getPaymentAccountByUserId = async (user_id: string | undefined) => {
  const revalidatedData = await fetch(`/api/payment-account/${user_id}`, {
    method: "GET",
    next: { revalidate: 10 },
  });

  const data = await revalidatedData.json();

  if (data.code === 200) return data.data as paymentAcccount;

  if (data.code === 404) {
    throw new Error("ACCOUNT_NOT_FOUND");
  } else {
    throw new Error("Something went wrong.");
  }
};

export const useGetPaymentAccountByUserId = (user_id: string | undefined) => {
  return useQuery({
    queryKey: ["get_payment_account_by_user_id", user_id],
    queryFn: () => getPaymentAccountByUserId(user_id),
    enabled: !!user_id,
  });
};
