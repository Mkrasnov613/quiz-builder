import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-gradient-card backdrop-blur-sm border-b border-border-muted px-6 py-4">
      <div className=" mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary">
          Quiz Builder
        </Link>
        <div className="flex gap-6 text-sm font-medium text-text-muted justify-center items-center">
          <Link href="/quizzes" className="hover:text-primary hidden md:block transition-colors">
            All Quizzes
          </Link>
          <Link
            href="/create"
            className="bg-gradient-btn-secondary text-bg-dark px-4 py-1.5 rounded-md hover:brightness-110 transition-all"
          >
            Create Quiz +
          </Link>
        </div>
      </div>
    </nav>
  );
}
