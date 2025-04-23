import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shaHash(message, algorithm: 'SHA-512' | 'SHA-256' = 'SHA-256') {
  const msgBuffer = new TextEncoder().encode(message);
  return crypto.subtle.digest(algorithm, msgBuffer).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  });
}
