import { getPaymentAccountByUserId } from "@/model/paymentAccount";

export async function GET(
  req: Request,
  { params }: { params: { user_id: string } }
) {
  const user_id = params.user_id;

  if (!user_id || typeof user_id !== "string") {
    return Response.json(
      {
        data: null,
        code: 400,
        message: "User Id is required",
      },
      { status: 400 }
    );
  }

  try {
    const paymentAccount = await getPaymentAccountByUserId(user_id);

    if (paymentAccount) {
      return Response.json(
        {
          data: paymentAccount,
          code: 200,
          message: "Payment account retrived successfully.",
        },
        {
          status: 200,
        }
      );
    } else {
      return Response.json(
        {
          data: null,
          code: 404,
          message: "Payment account not found.",
        },
        {
          status: 404,
        }
      );
    }
  } catch (error) {
    return Response.json(
      {
        data: null,
        code: 500,
        message: "Internal Server Error.",
      },
      { status: 500 }
    );
  }
}
