import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

type PossibleRef<T> = React.Ref<T> | undefined

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatToCurrency(number: number | undefined) {
  if (!number) return

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number).toString();
}