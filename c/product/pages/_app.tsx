import type { AppProps } from "next/app";
import { withRouter } from "next/router";
import Message from "../components/message";
import Head from "next/head";
import styles from "../styles/app.module.css";
import "../styles/globals.css";

function DebateSH({ Component, pageProps, router }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <title>debate.sh</title>
      </Head>
      <div className={styles.pageWrapper}>
        {router.query.error && (
          <Message error={true} message={router.query.error.toString()} />
        )}
        {router.query.message && (
          <Message error={false} message={router.query.message.toString()} />
        )}
        <div className={styles.main}>
          <Component {...pageProps} />
        </div>
        <div className={styles.footer}>debate.sh ~ created by sam poder</div>
      </div>
    </>
  );
}

export default withRouter(DebateSH);
