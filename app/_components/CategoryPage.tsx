import Link from 'next/link'
import Image from 'next/image'
import { getPostsBySpecificCategory, getCategoryStats } from '@/lib/blog'

interface CategoryPageProps {
  categorySlug: string
}

export async function CategoryPage({ categorySlug }: CategoryPageProps) {
  const posts = await getPostsBySpecificCategory(categorySlug)
  const allCategories = await getCategoryStats()
  
  // Find the current category name
  const currentCategory = allCategories.find(cat => cat.slug === categorySlug)
  const categoryName = currentCategory?.name || categorySlug.replace('-', ' ')

  if (posts.length === 0) {
    return (
      <div className="my-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {categoryName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            No posts found in this category yet.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            ← Back to all posts
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="my-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <Link href="/blog" className="hover:text-gray-700 dark:hover:text-gray-300">
            Blog
          </Link>
          <span>→</span>
          <span className="text-gray-900 dark:text-gray-100 font-medium">
            {categoryName}
          </span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {categoryName}
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
          Explore all articles in the {categoryName.toLowerCase()} category.
        </p>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} in this category
        </div>
      </div>

      {/* Category Navigation */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/blog"
            className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            All Categories
          </Link>
          {allCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/blog/category/${category.slug}`}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                category.slug === categorySlug
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800'
              }`}
            >
              {category.name} ({category.count})
            </Link>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600"
          >
            {/* Post Image */}
            {post.image && (
              <div className="relative h-48 w-full">
                <Image
                  src={post.image}
                  alt={post.imageAlt || `Cover image for ${post.title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}

            <div className="p-6">
              <div className="flex flex-col space-y-4">
                {/* Date */}
                <time
                  dateTime={post.date}
                  className="text-sm text-gray-500 dark:text-gray-400"
                >
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>

                {/* Excerpt */}
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">
                  {post.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {post.readTime}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors text-sm"
                  >
                    Read article
                    <svg
                      className="ml-1 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Back to Blog */}
      <div className="mt-12 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <svg
            className="mr-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 17l-5-5m0 0l5-5m-5 5h12"
            />
          </svg>
          Back to all posts
        </Link>
      </div>
    </div>
  )
}