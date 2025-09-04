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
  category?: string
  description?: string
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const blogDir = path.join(process.cwd(), 'content/blog')
    
    // Check if blog directory exists
    try {
      await fs.access(blogDir)
    } catch {
      console.log('Blog directory does not exist yet')
      return []
    }
    
    const files = await fs.readdir(blogDir)
    const mdxFiles = files.filter(file => file.endsWith('.mdx') || file.endsWith('.md'))
    
    if (mdxFiles.length === 0) {
      console.log('No blog posts found')
      return []
    }
    
    const posts = await Promise.all(
      mdxFiles.map(async (file) => {
        const filePath = path.join(blogDir, file)
        const content = await fs.readFile(filePath, 'utf8')
        const { data, content: markdownContent } = matter(content)
        
        // Calculate estimated read time (average 200 words per minute)
        const wordCount = markdownContent.split(/\s+/).length
        const readTime = Math.ceil(wordCount / 200)
        
        return {
          title: data.title || 'Untitled Post',
          excerpt: data.excerpt || data.description || markdownContent.slice(0, 150).replace(/[#*`]/g, '') + '...',
          date: data.date || new Date().toISOString().split('T')[0],
          slug: file.replace(/\.(mdx|md)$/, ''),
          readTime: data.readTime || `${readTime} min read`,
          category: data.category || data.tags?.[0] || 'Article'
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

export async function AllBlogPosts() {
  const allPosts = await getBlogPosts()

  if (allPosts.length === 0) {
    return (
      <div className="my-8">
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
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
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Blog Posts Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We haven't published any blog posts yet. Check back soon for updates!
          </p>
          <Link 
            href="/"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
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
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="my-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Discover our latest articles, tutorials, and insights. 
          We publish new content regularly to help you get the most out of your documentation.
        </p>
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          {allPosts.length} {allPosts.length === 1 ? 'post' : 'posts'} published
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {allPosts.map((post) => (
          <article 
            key={post.slug} 
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600"
          >
            <div className="flex flex-col space-y-4">
              {/* Category and Date */}
              <div className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {post.category}
                </span>
                <time 
                  dateTime={post.date}
                  className="text-gray-500 dark:text-gray-400"
                >
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </time>
              </div>
              
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
          </article>
        ))}
      </div>

      {/* Back to Home */}
      <div className="mt-12 text-center">
        <Link 
          href="/"
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
          Back to Home
        </Link>
      </div>
    </div>
  )
}