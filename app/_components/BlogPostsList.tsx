import Link from 'next/link'
import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'

interface BlogPost {
  title: string
  excerpt: string
  date: string
  slug: string
  readTime?: string
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const blogDir = path.join(process.cwd(), 'content/blog')
    const files = await fs.readdir(blogDir)
    
    const posts = await Promise.all(
      files
        .filter(file => file.endsWith('.mdx'))
        .map(async (file) => {
          const filePath = path.join(blogDir, file)
          const content = await fs.readFile(filePath, 'utf8')
          const { data } = matter(content)
          
          return {
            title: data.title || 'Untitled',
            excerpt: data.excerpt || 'No excerpt available',
            date: data.date || new Date().toISOString(),
            slug: file.replace('.mdx', ''),
            readTime: data.readTime || '5 min read'
          }
        })
    )
    
    // Sort by date (newest first)
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error('Error reading blog posts:', error)
    return []
  }
}

export async function BlogPostsList() {
  const allPosts = await getBlogPosts()
  const featuredPosts = allPosts.slice(0, 3)

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
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
          >
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