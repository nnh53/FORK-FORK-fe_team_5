/* eslint-disable no-extend-native */
import { formatInTimeZone } from "date-fns-tz";

// This block tells TypeScript that the native Date object now has our custom method.
declare global {
  interface Date {
    toICTISOString(timeZone?: string): string;
  }
}

// This attaches the new method to the Date prototype, making it globally available.
Date.prototype.toICTISOString = function (timeZone: string = "Asia/Ho_Chi_Minh"): string {
  const formatString = "yyyy-MM-dd'T'HH:mm";
  return formatInTimeZone(this, timeZone, formatString);
};

// Add a dummy export to ensure the file is treated as a module.
export {};

// --- Example Usage ---

// 1. Get the current date and time
const now = new Date(); // Let's assume this is Tue, 29 Jul 2025 13:33:00 UTC

// 2. Convert it using the new native method, just like toISOString()
const ictString = now.toICTISOString();

// 3. Log the results
console.log(`Current UTC Time: ${now.toISOString()}`);
console.log(`Formatted ICT Time: ${ictString}`);

// Expected Output:
// Current UTC Time  : 2025-07-29T13:33:00.000Z
// Formatted ICT Time: 2025-07-29T20:33:00+07:00
