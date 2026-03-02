import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  projectTitle: string;
}

export function Breadcrumb({ projectTitle }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
      <Link href="/" className="hover:text-foreground transition-colors">
        Home
      </Link>
      <ChevronRight className="h-3.5 w-3.5" />
      <Link href="/portfolio" className="hover:text-foreground transition-colors">
        Portfolio
      </Link>
      <ChevronRight className="h-3.5 w-3.5" />
      <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
        {projectTitle}
      </span>
    </nav>
  );
}
