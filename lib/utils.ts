import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "qs";

import { aspectRatioOptions } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Logs an error to the console and throws a user-friendly error message.
 * @param error the error to handle
 */
export function handleError(error: unknown): never {
  if (error instanceof Error) {
    // This is a native JavaScript error (e.g., TypeError, RangeError)
    console.error(error.message);
    throw new Error(`Error: ${error.message}`);
  } else if (typeof error === "string") {
    // This is a string error message
    console.error(error);
    throw new Error(`Error: ${error}`);
  } else {
    // This is an unknown type of error
    console.error(error);
    throw new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
}

/**
 * Returns an SVG string for a shimmer effect with the specified width and height.
 * @param w the width of the shimmer
 * @param h the height of the shimmer
 */
function shimmer(w: number, h: number): string {
  return `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#7986AC" offset="20%" />
          <stop stop-color="#68769e" offset="50%" />
          <stop stop-color="#7986AC" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#7986AC" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
    </svg>`;
}

/**
 * Encodes a string into base64.
 * @param str the string to encode
 * @returns the base64 encoded string
 */
function toBase64(str: string): string {
  if (typeof window === "undefined") {
    // Node.js environment
    return Buffer.from(str).toString("base64");
  } else {
    // Browser environment
    return window.btoa(str);
  }
}

/**
 * Returns a base64 encoded shimmer SVG as a data URL.
 */
function getDataUrl(): string {
  return `data:image/svg+xml;base64,${toBase64(shimmer(1000, 1000))}`;
}

export const dataUrl: string = getDataUrl();

/**
 * Creates a new URL with the specified query parameter added or updated.
 *
 * @param searchParams - The search parameters of the URL.
 * @param key - The key of the query parameter to add or update.
 * @param value - The value of the query parameter to add or update.
 * @returns {string} Returns the updated URL with the specified query parameter added or updated.
 */
export function formUrlQuery({
  searchParams,
  key,
  value,
}: FormUrlQueryParams): string {
  const params = { ...qs.parse(searchParams.toString()), [key]: value };

  return `${window.location.pathname}?${qs.stringify(params, {
    skipNulls: true,
  })}`;
}

/**
 * Removes specified keys from the query parameters of a URL and returns the updated URL.
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.searchParams - The search parameters of the URL.
 * @param {string[]} params.keysToRemove - The keys to remove from the URL query parameters.
 * @returns {string} Returns the updated URL with specified keys removed.
 */
export function removeKeysFromQuery({
  searchParams,
  keysToRemove,
}: RemoveUrlQueryParams): string {
  // Parse the search parameters string into an object
  const currentUrl = qs.parse(searchParams);

  // Remove keys specified in keysToRemove array
  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  // Remove null or undefined values
  Object.keys(currentUrl).forEach(
    (key) => currentUrl[key] == null && delete currentUrl[key]
  );

  // Reconstruct the updated URL with the modified query parameters
  return `${window.location.pathname}?${qs.stringify(currentUrl)}`;
}

/**
 * Creates a debounced function that delays invoking `func` until after `delay` milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The number of milliseconds to delay.
 * @returns {Function} Returns the new debounced function.
 */
export function debounce(
  func: (...args: any[]) => void,
  delay: number
): Function {
  /**
   * The timeout ID used to track the setTimeout call.
   * @type {NodeJS.Timeout | null}
   */
  let timeoutId: NodeJS.Timeout | null;
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}

export type AspectRatioKey = keyof typeof aspectRatioOptions;

/**
 * Gets the size (width or height) of an image based on the provided type and image object.
 *
 * @param {string} type - The type of transformation.
 * @param {object} image - The image object.
 * @param {"width" | "height"} dimension - The dimension to retrieve ("width" or "height").
 * @returns {number} Returns the size (width or height) of the image.
 */
export function getImageSize(
  type: string,
  image: any,
  dimension: "width" | "height"
): number {
  if (type === "fill") {
    // If the type is "fill", return the dimension based on aspect ratio options
    return (
      aspectRatioOptions[image.aspectRatio as AspectRatioKey]?.[dimension] ||
      1000
    );
  }

  // If the type is not "fill", return the dimension from the image object or a default value of 1000
  return image?.[dimension] || 1000;
}

/**
 * Downloads a file from a given URL to the user's device.
 * @param url the URL of the file to download
 * @param filename the suggested filename for the downloaded file
 * @throws {Error} if the URL is not provided
 */
export function download(url: string, filename?: string): void {
  if (!url) {
    throw new Error("Resource URL not provided! You need to provide one");
  }

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobURL = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobURL;

      if (filename && filename.length) {
        a.download = `${filename.replace(" ", "_")}.png`;
      }
      document.body.appendChild(a);
      a.click();
    })
    .catch((error) => console.log({ error }));
}

/**
 * Recursively merges two objects, handling nested objects and arrays.
 * @param obj1 the first object to merge
 * @param obj2 the second object to merge
 */
export function deepMergeObjects(obj1: any, obj2: any): any {
  if (obj2 === null || obj2 === undefined) {
    return obj1;
  }

  let output = { ...obj2 };

  for (let key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      if (
        obj1[key] &&
        typeof obj1[key] === "object" &&
        obj2[key] &&
        typeof obj2[key] === "object"
      ) {
        output[key] = deepMergeObjects(obj1[key], obj2[key]);
      } else {
        output[key] = obj1[key];
      }
    }
  }

  return output;
}
