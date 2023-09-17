import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function chatHrefConstructor(id1, id2) {
  const sortedIds = [id1, id2].sort();
  return `${sortedIds[0]}--${sortedIds[1]}`;
}

export function toPusherKey(key) {
  return key.replace(/:/g, "__");
}

export function isValidURL(url) {
  const urlPattern =
    /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/;
  return urlPattern.test(url);
}

export function linkify(inputText) {
  if (!inputText || typeof inputText !== "string") return inputText;

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return inputText.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: blue;">${url}</a>`;
  });
}
