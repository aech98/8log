import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const customTailwindMerge = extendTailwindMerge({
  classGroups: {
    'font-family': [{ font: ['inter', 'stix'] }],
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTailwindMerge(clsx(inputs));
}
