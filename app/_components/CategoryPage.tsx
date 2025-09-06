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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <Link href="/blog" className="hover:text-gray-700 dark:hover:text-gray-300">
              Blog
            </Link>
            <span>→</span>
            <span className="capitalize">{categoryName}</span>
          </div>

          <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <svg 
              className="w-12 h-12 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 capitalize">
            {categoryName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            No posts found in this category yet. Check back soon for updates!
          </p>
          
          <div className="space-x-4">
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              ← Back to all posts
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <Link href="/blog" className="hover:text-gray-700 dark:hover:text-gray-300">
            Blog
          </Link>
          <span>→</span>
          <span className="capitalize">{categoryName}</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 capitalize">
          {categoryName}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
          {posts.length} {posts.length === 1 ? 'article' : 'articles'} in this category
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {posts.map((post) => (
          <article 
            key={post.slug} 
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600"
          >
            {/* Post Image */}
            {post.image && (
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.imageAlt || post.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-200"
                />
              </div>
            )}
            
            <div className="p-6">
              {/* Date and Read Time */}
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <span>{post.readTime}</span>
              </div>
              
              {/* Title */}
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight">
                <Link 
                  href={`/blog/${post.slug}`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {post.title}
                </Link>
              </h2>
              
              {/* Excerpt */}
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                {post.excerpt}
              </p>
              
              {/* Read More Link */}
              <Link 
                href={`/blog/${post.slug}`}
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
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