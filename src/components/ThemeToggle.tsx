'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <Button variant="ghost" size="icon" aria-label="Toggle theme"><Sun className="h-5 w-5" /></Button>;
  }

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const icon = theme === 'dark'
    ? <Moon className="h-5 w-5" />
    : theme === 'system'
      ? <Monitor className="h-5 w-5" />
      : <Sun className="h-5 w-5" />;

  const label = theme === 'dark'
    ? 'Dark mode (click for system)'
    : theme === 'system'
      ? 'System theme (click for light)'
      : 'Light mode (click for dark)';

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      onClick={cycleTheme}
    >
      {icon}
    </Button>
  );
}
