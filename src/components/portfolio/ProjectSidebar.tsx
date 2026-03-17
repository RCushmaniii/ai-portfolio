import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Calendar, Code2, Activity } from 'lucide-react';
import { t, type Locale } from '@/i18n';
import type { PortfolioProject } from '@/lib/portfolio/types';

interface ProjectSidebarProps {
  project: PortfolioProject;
  locale: Locale;
}

export function ProjectSidebar({ project, locale }: ProjectSidebarProps) {
  const dict = t(locale);

  return (
    <aside className="space-y-6">
      {/* Action Buttons */}
      <div className="space-y-2">
        {project.demo_url && (
          <Button asChild className="w-full">
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
              {dict.sidebar_try_demo} <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        )}
        {project.live_url && project.live_url !== project.demo_url && (
          <Button variant="secondary" asChild className="w-full">
            <a href={project.live_url} target="_blank" rel="noopener noreferrer">
              {dict.sidebar_view_live} <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        )}
        <Button variant="outline" asChild className="w-full">
          <a href={project.repo_url} target="_blank" rel="noopener noreferrer">
            <Github className="mr-2 h-4 w-4" /> GitHub
          </a>
        </Button>
      </div>

      {/* Metadata */}
      <div className="space-y-3 text-sm">
        <MetadataRow icon={<Activity className="h-4 w-4" />} label={dict.sidebar_category}>
          <Badge variant="outline">{project.category}</Badge>
        </MetadataRow>

        <MetadataRow icon={<Code2 className="h-4 w-4" />} label={dict.sidebar_status}>
          <Badge variant={project.status === 'Production' ? 'default' : 'secondary'}>
            {project.status}
          </Badge>
        </MetadataRow>

        {project.date_completed && (
          <MetadataRow icon={<Calendar className="h-4 w-4" />} label={dict.sidebar_completed}>
            <span>{project.date_completed}</span>
          </MetadataRow>
        )}
      </div>
    </aside>
  );
}

function MetadataRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-2 text-muted-foreground">
        {icon}
        {label}
      </span>
      {children}
    </div>
  );
}
