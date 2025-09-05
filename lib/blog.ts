import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface BlogPost {
  title: string
  excerpt: string
  category: string
  date: string
  slug: string
  readTime?: string
  image?: string
  imageAlt?: string
}
export interface CategoryGroup {
  category: string
  posts: BlogPost[]
  count: number
}

export interface CategoryStats {
  name: string
  count: number
  slug: string
}
// Helper function to validate and normalize image paths
function normalizeImagePath(imagePath: string | undefined): string | undefined {
  if (!imagePath || typeof imagePath !== 'string') {
    return undefined
  }
  
  const cleanPath = imagePath.trim()
  
  // If path starts with '/', it's already absolute
  if (cleanPath.startsWith('/')) {
    return cleanPath
  }
  
  // If path starts with '/', it's already absolute
  return `/${cleanPath}`
}

// Helper function to create URL-friendly slugs
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
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
          category: data.category || 'Uncategorized',
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

// Get all posts grouped by category
export async function getPostsByCategory(): Promise<CategoryGroup[]> {
  const allPosts = await getBlogPosts()
  
  // Group posts by category
  const categoryMap = new Map<string, BlogPost[]>()
  
  allPosts.forEach(post => {
    const category = post.category || 'Uncategorized'
    if (!categoryMap.has(category)) {
      categoryMap.set(category, [])
    }
    categoryMap.get(category)!.push(post)
  })
  
  // Convert to array and sort by category name
  const categoryGroups: CategoryGroup[] = Array.from(categoryMap.entries())
    .map(([category, posts]) => ({
      category,
      posts: posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      count: posts.length
    }))
    .sort((a, b) => a.category.localeCompare(b.category))
  
  return categoryGroups
}

// Get posts for a specific category
export async function getPostsBySpecificCategory(categorySlug: string): Promise<BlogPost[]> {
  const allPosts = await getBlogPosts()
  
  // Convert category slug back to original format for matching
  const categoryName = categorySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  
  return allPosts.filter(post => {
    const postCategory = post.category || 'Uncategorized'
    return postCategory.toLowerCase() === categoryName.toLowerCase() ||
           createSlug(postCategory) === categorySlug
  })
}

// Get category statistics
export async function getCategoryStats(): Promise<CategoryStats[]> {
  const allPosts = await getBlogPosts()
  
  // Count posts per category
  const categoryCount = new Map<string, number>()
  
  allPosts.forEach(post => {
    const category = post.category || 'Uncategorized'
    categoryCount.set(category, (categoryCount.get(category) || 0) + 1)
  })
  
  // Convert to array with slugs
  return Array.from(categoryCount.entries())
    .map(([name, count]) => ({
      name,
      count,
      slug: createSlug(name)
    }))
    .sort((a, b) => b.count - a.count) // Sort by count (most posts first)
}

// Get featured posts from each category
export async function getFeaturedPostsByCategory(limit: number = 2): Promise<CategoryGroup[]> {
  const categoryGroups = await getPostsByCategory()
  
  return categoryGroups.map(group => ({
    ...group,
    posts: group.posts.slice(0, limit) // Take only the first 'limit' posts from each category
  }))
}