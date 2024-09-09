import { cn } from "@/lib/utils";
import { TbLoader2 } from "react-icons/tb";

export default function Loader({ style = {}, className = "" }) {
  return (
    <TbLoader2
      style={style}
      className={cn("animate-spin duration-300", className)}
    />
  );
}
