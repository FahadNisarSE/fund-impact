import { del } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const blobUrl = body.blob_url;

    if (!blobUrl) {
      return NextResponse.json(
        {
          data: null,
          code: 400,
          message: "Blob URL is required.",
        },
        { status: 400 }
      );
    }

    // Perform the deletion
    await del(blobUrl);

    return NextResponse.json(
      {
        data: null,
        code: 201,
        message: "Blob deleted successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Blob Deletion Endpoint: ", error);

    return NextResponse.json(
      {
        data: null,
        code: 500,
        message: "An error occurred while deleting the blob.",
      },
      { status: 500 }
    );
  }
}
