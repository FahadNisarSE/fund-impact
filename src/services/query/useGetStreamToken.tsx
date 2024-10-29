import {getStreamToken} from "@/action/stream/streamAuthToken";
import { useMutation } from "@tanstack/react-query";

export function useGetStreamToken() {
  return useMutation({
    mutationFn: getStreamToken,
    mutationKey: ["get_stream_token"],
  });
}
