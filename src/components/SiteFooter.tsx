import { Github } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t py-8 mt-16">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} CushLabs AI Services. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a
            href="https://cushlabs.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            cushlabs.ai
          </a>
          <a
            href="https://github.com/RCushmaniii"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
