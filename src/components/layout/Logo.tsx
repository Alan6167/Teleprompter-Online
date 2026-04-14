import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  /** Render with brand-colored square background (for headers/footers). */
  withBackground?: boolean;
}

/**
 * Brand logo — matches the favicon / PWA icons exactly.
 * The mark is a stylized microphone with a base, representing a teleprompter mic.
 */
export function Logo({ className, withBackground = true }: LogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-8 w-8', className)}
      aria-hidden="true"
    >
      {withBackground && <rect width="64" height="64" rx="14" fill="#2563eb" />}
      <path
        d="M32 14c-5 0-9 4-9 9v10c0 5 4 9 9 9s9-4 9-9V23c0-5-4-9-9-9z"
        fill={withBackground ? '#fff' : 'currentColor'}
      />
      <path
        d="M22 34h20M32 42v8M24 50h16"
        stroke={withBackground ? '#fff' : 'currentColor'}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
