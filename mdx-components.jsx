import { useMDXComponents as getNextraComponents } from 'nextra/mdx-components'

 
const defaultComponents = getNextraComponents({
  wrapper({ children, toc }) {
    return (
      <>
        <div>{children}</div>
   
      </>
    )
  }
})
 
export const useMDXComponents = components => ({
  ...defaultComponents,
  ...components
})