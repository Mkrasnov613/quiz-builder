import Link from 'next/link';

export default function Home() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-text mb-4">Welcome to Quiz Builder</h1>
      <p className="text-text-muted text-lg mb-8">Create, manage, and browse your quizzes.</p>
      <div className="flex justify-center gap-4 flex-wrap">
        <Link
          href="/create"
          className="bg-gradient-btn-secondary text-bg-dark px-6 py-3 rounded-lg font-medium hover:brightness-110 transition-all"
        >
          Create a Quiz
        </Link>
        <Link
          href="/quizzes"
          className="border border-border text-text px-6 py-3 rounded-lg font-medium hover:bg-bg-light transition-colors"
        >
          Browse Quizzes
        </Link>
      </div>
    </div>
  );
}
