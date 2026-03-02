import { Badge } from '@/components/ui/badge';
import { t, type Locale } from '@/i18n';
import type { PortfolioProject } from '@/lib/portfolio/types';

interface ProjectAsideProps {
  project: PortfolioProject;
  locale: Locale;
}

export function ProjectAside({ project, locale }: ProjectAsideProps) {
  const dict = t(locale);
  const hasTechStack = project.tech_stack.length > 0;
  const hasTopics = project.github_topics.length > 0;
  const hasTags = project.tags.length > 0;

  if (!hasTechStack && !hasTopics && !hasTags) return null;

  return (
    <aside className="space-y-6">
      {hasTechStack && (
        <div>
          <h3 className="text-sm font-semibold mb-3">{dict.aside_tech_stack}</h3>
          <div className="flex flex-wrap gap-1.5">
            {project.tech_stack.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {hasTopics && (
        <div>
          <h3 className="text-sm font-semibold mb-3">{dict.aside_topics}</h3>
          <div className="flex flex-wrap gap-1.5">
            {project.github_topics.map((topic) => (
              <Badge key={topic} variant="outline" className="text-xs">
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {hasTags && (
        <div>
          <h3 className="text-sm font-semibold mb-3">{dict.aside_tags}</h3>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
