import { TPostClientSchema } from "@/schema/post.schema.client";
import { useMutation } from "@tanstack/react-query";
import { posts } from "../../../db/types";

// Function to delete an image
async function deleteImage(image: string) {
  try {
    await fetch("/api/file/delete", {
      method: "DELETE",
      body: JSON.stringify({
        blob_url: image,
      }),
    });
  } catch (error) {}
}

// Function to upload an image
async function uploadImage(image: File | undefined) {
  if (!image) throw new Error("Please select a file first.");

  const response = await fetch(`/api/file?filename=${image.name}`, {
    method: "POST",
    body: image,
  });

  const imageResponse = await response.json();

  if (!response.ok) {
    throw new Error(imageResponse.message || "Image upload failed");
  }

  return imageResponse.data.url;
}

async function createNewProject(param: {
  info: TPostClientSchema;
  projectId: string;
}) {
  const imageUrl = await uploadImage(param.info.image);

  const payload = {
    image: imageUrl,
    title: param.info.title,
    content: param.info.content,
    projectId: param.projectId,
  };

  const response = await fetch("/api/post/create", {
    body: JSON.stringify(payload),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const postResponse = await response.json();

  if (!response.ok) {
    await deleteImage(imageUrl);
    throw new Error(postResponse.message || "Post creation failed.");
  }

  return postResponse.data as posts;
}

export default function useCreateProjectPost() {
  return useMutation({
    mutationKey: ["create_new_post"],
    mutationFn: createNewProject,
  });
}
