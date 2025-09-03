// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;
import nextra from 'nextra'

const withNextra = nextra({
  mdxOptions: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withNextra({
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx']
})