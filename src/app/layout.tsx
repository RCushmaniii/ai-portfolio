// Pass-through root. The real <html>/<body> are rendered per-locale in
// app/[locale]/layout.tsx (so the lang attribute is correct for /es), and by
// the self-contained not-found.tsx / global-error.tsx. This lets Spanish routes
// ship lang="es" instead of a hardcoded lang="en".
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
