import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'



export default async function Home() {
  
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to My Site</h1>
      <p>This is my personal website built with Nextra and Next.js!</p>
      
      
    
    </div>
  )
}