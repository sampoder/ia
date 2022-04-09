import type { AppProps } from "next/app";
import "../styles/globals.css";
import { withRouter } from "next/router";
import Message from "../components/message";

function DebateSH({ Component, pageProps, router }: AppProps) {
  return (
    <>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        {router.query.error && (
          <Message error={true} message={router.query.error.toString()} />
        )}
        {router.query.message && (
          <Message error={false} message={router.query.message.toString()} />
        )}
        <div style={{ flexGrow: 1, position: "relative" }}>
          <Component {...pageProps} />
        </div>
        <div
          style={{
            background: "var(--sunken)",
            padding: "var(--spacing-3)",
            textAlign: "center",
            marginTop: "24px",
            fontWeight: 500,
          }}
        >
          debate.sh ~ created by @sampoder
        </div>
      </div>
    </>
  );
}

export default withRouter(DebateSH);
