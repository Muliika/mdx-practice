import { CategoryPage } from '@/app/_components/CategoryPage'
import { getCategoryStats, getPostsBySpecificCategory } from '@/lib/blog'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    slug: string
  }
}

// Generate static params for all categories at build time
export async function generateStaticParams() {
  try {
    const categories = await getCategoryStats()
    
    return categories.map((category) => ({
      slug: category.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export default async function CategoryPageRoute({ params }: PageProps) {
  try {
    // Check if category exists and has posts
    const posts = await getPostsBySpecificCategory(params.slug)
    const categories = await getCategoryStats()
    const categoryExists = categories.some(cat => cat.slug === params.slug)
    
    if (!categoryExists) {
      notFound()
    }

    return <CategoryPage categorySlug={params.slug} />
  } catch (error) {
    console.error('Error loading category page:', error)
    notFound()
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  try {
    const categories = await getCategoryStats()
    const category = categories.find(cat => cat.slug === params.slug)
    
    if (!category) {
      return {
        title: 'Category Not Found'
      }
    }

    return {
      title: `${category.name} Articles - Blog`,
      description: `Browse all ${category.count} posts in the ${category.name} category.`,
    }
  } catch (error) {
    return {
      title: 'Category - Blog'
    }
  }
}