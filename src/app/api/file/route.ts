import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");

    if (!filename || !request.body) {
      return NextResponse.json(
        {
          data: null,
          code: 400,
          message: "An image file is required",
        },
        {
          status: 400,
        }
      );
    }

    const blob = await put(filename, request.body, {
      access: "public",
    });

    return NextResponse.json(
      {
        data: blob,
        code: 201,
        message: "Image uploaded successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        code: 500,
        message: "An error occurred while deleting the image.",
      },
      { status: 500 }
    );
  }
}
