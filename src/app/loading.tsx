import Image from "next/image";

export default function Loading() {
  return (
    <div className="h-[90vh] w-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-8 max-w-md">
        <Image
          src="/logo.svg"
          alt="Fund Impact"
          className="object-contain"
          width={200}
          height={200}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          className="text-green-500"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
          >
            <animateTransform
              attributeName="transform"
              dur="0.75s"
              repeatCount="indefinite"
              type="rotate"
              values="0 12 12;360 12 12"
            />
          </path>
        </svg>
        <p className="text-center text-muted-foreground">
          "The only way to discover the limits of the possible is to go beyond
          them into the impossible." - Arthur C. Clarke
        </p>
      </div>
    </div>
  );
}
