import Link from 'next/link'
import { getCategoryStats } from '@/lib/blog'

export async function CategoryNav() {
  const categories = await getCategoryStats()

  if (categories.length === 0) {
    return (
      <div className="mb-8">
        <p className="text-gray-500 dark:text-gray-400">No categories available yet.</p>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Browse by Category
      </h3>
      <div className="flex flex-wrap gap-3">
        {/* All Posts Link */}
        <Link
          href="/blog"
          className="px-4 py-2 text-sm font-medium rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          All Posts
        </Link>
        
        {/* Category Links */}
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/blog/category/${category.slug}`}
            className="px-4 py-2 text-sm font-medium rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors duration-200 hover:shadow-sm"
          >
            {category.name} ({category.count})
          </Link>
        ))}
      </div>
    </div>
  )
}