import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from 'sonner';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function showError(message: string, description?: string) {
  toast.error(message, {
    description: description,
  });
}
export async function handleMockFetch<T>(mockData: T, timeout = 500): Promise<{ data: T | null; error: string | null }> {
  return new Promise(resolve => {
    setTimeout(() => {
      // Simulate a potential fetch failure
      if (Math.random() < 0.1) { // 10% chance of failure
        resolve({ data: null, error: 'Failed to load mock data. Please try again.' });
      } else {
        resolve({ data: mockData, error: null });
      }
    }, timeout);
  });
}