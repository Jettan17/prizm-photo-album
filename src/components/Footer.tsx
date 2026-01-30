export function Footer() {
  return (
    <footer className="text-center py-6 sm:py-12 text-neutral-400 text-xs sm:text-sm px-4">
      Built with{" "}
      <a
        href="https://claude.ai/code"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-neutral-600 active:text-neutral-700 transition-colors px-1 py-2 -mx-1 -my-2 inline-block"
      >
        Claude Code
      </a>
      , Next.js, React &amp; Tailwind CSS
    </footer>
  );
}
