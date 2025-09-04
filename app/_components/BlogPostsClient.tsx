"use client"
import Link from 'next/link'
import Image from 'next/image'
import { BlogPost } from '@/lib/blog'

interface BlogPostsClientProps {
  posts: BlogPost[]
}

export function BlogPostsClient({ posts }: BlogPostsClientProps) {
  const featuredPosts = posts.slice(0, 3)

  if (featuredPosts.length === 0) {
    return (
      <div className="my-8 text-center text-gray-500 dark:text-gray-400">
        <p>No blog posts available yet.</p>
      </div>
    )
  }

  return (
    <div className="my-8 max-w-4xl px-4">
      <div className="grid gap-6">
        {featuredPosts.map((post) => (
          <article 
            key={post.slug} 
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            {/* Image Section */}
            {post.image ? (
              <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-800">
                <Image
                  src={post.image}
                  alt={post.imageAlt || post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={(e) => {
                    console.error('Image failed to load:', post.image)
                    const target = e.currentTarget as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                      `
                    }
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', post.image)
                  }}
                />
              </div>
            ) : (
              <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <svg 
                    className="w-12 h-12 text-gray-400 mx-auto mb-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                    />
                  </svg>
                  <p className="text-sm text-gray-500 dark:text-gray-400">No image</p>
                </div>
              </div>
            )}
            
            {/* Content Section */}
            <div className="p-6">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <span>{post.readTime}</span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <Link 
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  Read more 
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
          </article>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Link 
          href="/blog"
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          View All Posts
          <svg 
            className="ml-2 w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 7l5 5m0 0l-5 5m5-5H6" 
            />
          </svg>
        </Link>
      </div>
    </div>
  )
}