import Link from 'next/link';

export default function Home() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Quiz Builder</h1>
      <p className="text-gray-500 text-lg mb-8">Create, manage, and browse your quizzes.</p>
      <div className="flex justify-center gap-4 flex-wrap">
        <Link
          href="/create"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Create a Quiz
        </Link>
        <Link
          href="/quizzes"
          className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Browse Quizzes
        </Link>
      </div>
    </div>
  );
}
