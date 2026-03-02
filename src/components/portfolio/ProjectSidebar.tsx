import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Star, GitFork, Calendar, Code2, Activity } from 'lucide-react';
import type { PortfolioProject } from '@/lib/portfolio/types';

interface ProjectSidebarProps {
  project: PortfolioProject;
}

export function ProjectSidebar({ project }: ProjectSidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Action Buttons */}
      <div className="space-y-2">
        {project.demo_url && (
          <Button asChild className="w-full">
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
              Try Demo <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        )}
        {project.live_url && project.live_url !== project.demo_url && (
          <Button variant="secondary" asChild className="w-full">
            <a href={project.live_url} target="_blank" rel="noopener noreferrer">
              View Live <ExternalLink className="ml-2 h-4 w-4" />
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
        <MetadataRow icon={<Activity className="h-4 w-4" />} label="Category">
          <Badge variant="outline">{project.category}</Badge>
        </MetadataRow>

        <MetadataRow icon={<Code2 className="h-4 w-4" />} label="Status">
          <Badge variant={project.status === 'Production' ? 'default' : 'secondary'}>
            {project.status}
          </Badge>
        </MetadataRow>

        {project.github_stars > 0 && (
          <MetadataRow icon={<Star className="h-4 w-4" />} label="Stars">
            <span>{project.github_stars}</span>
          </MetadataRow>
        )}

        {project.github_forks > 0 && (
          <MetadataRow icon={<GitFork className="h-4 w-4" />} label="Forks">
            <span>{project.github_forks}</span>
          </MetadataRow>
        )}

        {project.github_language && (
          <MetadataRow icon={<Code2 className="h-4 w-4" />} label="Language">
            <span>{project.github_language}</span>
          </MetadataRow>
        )}

        {project.date_completed && (
          <MetadataRow icon={<Calendar className="h-4 w-4" />} label="Completed">
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
