import { useState, useEffect, Fragment } from "react";
import { run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime.js";

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
