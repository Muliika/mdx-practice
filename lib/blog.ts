import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface BlogPost {
  title: string
  excerpt: string
  date: string
  slug: string
  readTime?: string
  image?: string
  imageAlt?: string
}

// Helper function to validate and normalize image paths
function normalizeImagePath(imagePath: string | undefined): string | undefined {
  if (!imagePath || typeof imagePath !== 'string') {
    return undefined
  }
  
  const cleanPath = imagePath.trim()
  
  if (cleanPath.startsWith('/')) {
    return cleanPath
  }
  
  return `/${cleanPath}`
}

export async function getBlogPosts(): Promise<BlogPost[]> {
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
      return []
    }
    
    const posts = await Promise.all(
      mdxFiles.map(async (file) => {
        const filePath = path.join(blogDir, file)
        const content = await fs.readFile(filePath, 'utf8')
        const { data, content: markdownContent } = matter(content)
        
        // Normalize image path
        const normalizedImage = normalizeImagePath(data.image)
        
        // Calculate read time if not provided
        const wordCount = markdownContent.split(/\s+/).length
        const estimatedReadTime = Math.ceil(wordCount / 200)
        
        return {
          title: data.title || 'Untitled',
          excerpt: data.excerpt || data.description || markdownContent.slice(0, 150).replace(/[#*`]/g, '') + '...',
          date: data.date || new Date().toISOString().split('T')[0],
          slug: file.replace(/\.(mdx|md)$/, ''),
          readTime: data.readTime || `${estimatedReadTime} min read`,
          image: normalizedImage,
          imageAlt: data.imageAlt || data.title || 'Blog post image'
        }
      })
    )
    
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error('Error reading blog posts:', error)
    return []
  }
}