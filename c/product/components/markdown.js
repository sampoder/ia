import { useState, useEffect, Fragment } from "react";
import { run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime.js";

/* The component exported by the page renders Markdown to 
HTML/JSX using Next.js' standard @mdx-js/mdx */

export default function Markdown({ code }) {
  const [mdxModule, setMdxModule] = useState();
  const Content = mdxModule ? mdxModule.default : Fragment;
  useEffect(() => {
    (async () => {
      setMdxModule(await run(code, runtime));
    })();
  }, [code]);
  return <Content />;
}
