import { getBlogPosts } from '@/lib/blog'
import { BlogPostsClient } from './BlogPostsClient'

export async function BlogPostsList() {
  const allPosts = await getBlogPosts()
  
  return <BlogPostsClient posts={allPosts} />
}