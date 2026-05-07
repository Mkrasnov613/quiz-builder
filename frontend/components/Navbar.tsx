import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          Quiz Builder
        </Link>
        <div className="flex gap-6 text-sm font-medium text-gray-600">
          <Link href="/quizzes" className="hover:text-indigo-600 transition-colors">
            All Quizzes
          </Link>
          <Link
            href="/create"
            className="bg-indigo-600 text-white px-4 py-1.5 rounded-md hover:bg-indigo-700 transition-colors"
          >
            + Create Quiz
          </Link>
        </div>
      </div>
    </nav>
  );
}
