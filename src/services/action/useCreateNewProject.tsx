import { TProjectBasicsSchema } from "@/schema/project.client.schema";
import {
  TProjectDurationSchema,
  TProjectFundSchema,
} from "@/schema/project.schema";
import { useMutation } from "@tanstack/react-query";

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

// Function to create a new project
async function saveProject(payload: {
  projectBasics: Partial<TProjectBasicsSchema>;
  projectFund: Partial<TProjectFundSchema>;
  projectDuration: Partial<TProjectDurationSchema>;
  imageUrl: string;
}) {
  const { image, ...projectBasics } = payload.projectBasics;

  const response = await fetch("/api/project/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      projectBasics,
      projectFund: payload.projectFund,
      projectDuration: payload.projectDuration,
      imageUrl: payload.imageUrl,
    }),
  });

  const projectResponse = await response.json();

  if (!response.ok) {
    await deleteImage(payload.imageUrl);
    throw new Error(projectResponse.message || "Project creation failed");
  }

  return projectResponse;
}

// Function to handle the creation of a new project
async function createNewProject(payload: {
  projectBasics: Partial<TProjectBasicsSchema>;
  projectFund: Partial<TProjectFundSchema>;
  projectDuration: Partial<TProjectDurationSchema>;
}) {
  const imageUrl = await uploadImage(
    payload.projectBasics.image && payload.projectBasics.image[0]
  );
  return saveProject({ ...payload, imageUrl });
}

// Custom hook for creating a new project
export default function useCreateNewProject() {
  return useMutation({
    mutationKey: ["create_new_project"],
    mutationFn: createNewProject,
  });
}
