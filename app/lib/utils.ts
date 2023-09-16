import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function withDelay<T>(
  promise: Promise<T>,
  delay = 800,
): Promise<T> {
  const [result] = await Promise.allSettled([
    promise,
    new Promise<void>((resolve) => setTimeout(resolve, delay)),
  ]);

  if (result.status === "fulfilled") {
    return result.value;
  } else {
    return Promise.reject(result.reason);
  }
}

export function capitalize(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}
