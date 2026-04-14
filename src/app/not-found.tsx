import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[60dvh] items-center justify-center px-4 py-20">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold tracking-tight">404 — Page not found</h1>
        <p className="mt-4 text-muted-foreground">
          The page you are looking for isn&rsquo;t here. It may have been moved or never existed.
        </p>
        <div className="mt-8">
          <Button asChild>
            <a href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to the teleprompter
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
