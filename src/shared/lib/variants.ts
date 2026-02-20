import clsx from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { cva } from "class-variance-authority";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium rounded-sm transition-colors cursor-pointer focus:outline-none  disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-[#2B7FFF] text-white disabled:bg-[#EDEEF9] disabled:text-[#B0B4D8] px-5 py-1 font-gmarket font-bold",
        delete:
          "bg-white border border-[#FF6467] text-[#FF6467] px-5 py-1 disabled:bg-[#F5F7F9] disabled:border-[#E8EEF2] disabled:text-[#C7D0D7] font-bold font-gmarket",
        common:
          "bg-[#F8F8F8] border border-[#C7C7C7] text-[#737373] px-4 py-1 font-gmarket font-bold",
      },
    },
    defaultVariants: {
      variant: "common",
    },
  },
);
