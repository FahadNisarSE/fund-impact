import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { db } from "@/../db/db";
import { users } from "@/../db/schema";
import { profileSchemaApi } from "@/schema/profile.schema";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();

    try {
      const data = await profileSchemaApi.parseAsync(body);

      const result = await db
        .update(users)
        .set({ ...data })
        .where(eq(users.id, data.id))
        .returning();

      return NextResponse.json(
        {
          data: result[0],
          code: 200,
          message: "Profile updated successfully.",
        },
        { status: 200 }
      );
    } catch (error) {
      const err = error as ZodError;
      return NextResponse.json(
        {
          data: null,
          code: 400,
          message: err.message,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        code: 500,
        message: "An error occurred while updating profile.",
      },
      { status: 500 }
    );
  }
}
