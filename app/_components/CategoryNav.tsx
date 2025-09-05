import Link from 'next/link'
import { getCategoryStats } from '@/lib/blog'

export async function CategoryNav() {
  const categories = await getCategoryStats()

  if (categories.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Browse by Category
      </h3>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/blog"
          className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          All Posts
          <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
            {categories.reduce((total, cat) => total + cat.count, 0)}
          </span>
        </Link>
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/blog/category/${category.slug}`}
            className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            {category.name}
            <span className="ml-2 text-xs bg-blue-200 dark:bg-blue-800 px-2 py-0.5 rounded-full">
              {category.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}