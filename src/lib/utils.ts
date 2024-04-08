import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function convertToFormattedString(str: string) {
  const words = str.split("-");
  const capitalizedWords = words.map(
    (word: string) => word.charAt(0).toUpperCase() + word.slice(1),
  );
  const l = capitalizedWords.length;
  const len = capitalizedWords[l - 2].length;
  capitalizedWords[l - 2] =
    capitalizedWords[l - 2].slice(0, len - 1) +
    "'" +
    capitalizedWords[l - 2].slice(len - 1);
  const formattedString = capitalizedWords.join(" ");
  return formattedString;
}
