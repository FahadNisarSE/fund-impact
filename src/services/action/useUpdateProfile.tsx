import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { TProfileSchema } from "@/schema/profile.schema";

export async function updateProfile({
  payload,
  image,
}: {
  payload: TProfileSchema & { id: string };
  image: File | undefined;
}) {
  if (image) {
    if (payload?.image) {
      try {
        await axios({
          url: "/api/file/delete",
          method: "DELETE",
          data: {
            blob_url: payload?.image,
          },
        });
      } catch (error) {}
    }

    const { data } = await axios({
      url: `/api/file?filename=${image.name}`,
      method: "POST",
      data: image,
    });

    await axios({
      url: "/api/users/update",
      method: "POST",
      data: {
        ...payload,
        image: data.data.url,
      },
    });
  }
}

export default function useUpdateProfile() {
  return useMutation({
    mutationKey: ["update_profile"],
    mutationFn: updateProfile,
  });
}
