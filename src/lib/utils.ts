import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Class-name join used by shadcn-registry components. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
