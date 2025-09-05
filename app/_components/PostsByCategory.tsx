import Link from 'next/link'
import Image from 'next/image'
import { getPostsByCategory } from '@/lib/blog'

export async function PostsByCategory() {
  const categoryGroups = await getPostsByCategory()

  if (categoryGroups.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No posts found in any category.</p>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {categoryGroups.map((group) => (
        <section key={group.category} className="space-y-6">
          {/* Category Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {group.category}
            </h2>
            <Link
              href={`/blog/category/${group.category.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm"
            >
              View all {group.count} posts →
            </Link>
          </div>

          {/* Posts Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {group.posts.slice(0, 3).map((post) => (
              <article
                key={post.slug}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                {/* Post Image */}
                {post.image && (
                  <div className="relative h-40 w-full">
                    <Image
                      src={post.image}
                      alt={post.imageAlt || `Cover image for ${post.title}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}

                <div className="p-4">
                  <div className="space-y-3">
                    {/* Date */}
                    <time
                      dateTime={post.date}
                      className="text-sm text-gray-500 dark:text-gray-400"
                    >
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                      <Link
                                                href={`/blog/${post.slug}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* Read Time */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {post.readTime}
                      </span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                      >
                        Read more →
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}