import {useState, useEffect, Fragment} from 'react'
import * as runtime from 'react/jsx-runtime.js'
import {run} from '@mdx-js/mdx'

export default function Markdown({code}) {
  const [mdxModule, setMdxModule] = useState()
  const Content = mdxModule ? mdxModule.default : Fragment

  useEffect(() => {
    ;(async () => {
      setMdxModule(await run(code, runtime))
    })()
  }, [code])

  return <Content />
}