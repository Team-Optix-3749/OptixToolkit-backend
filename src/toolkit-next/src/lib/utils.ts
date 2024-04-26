import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function unixToFancyDate(unixTime: number) {
  const date = new Date(unixTime);

  const months = [
    "bad boy",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  date.getMonth();
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}
