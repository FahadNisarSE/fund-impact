import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { user } from "@/../../db/types";

const getUserById = async (id: string | undefined) => {
  if (!id) throw new Error("Invalid id is passed");
  const response = await axios.post(`/api/users/${id}`);
  return response.data.data as user;
};

export const useGetUserById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["get_user_by_id", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};
