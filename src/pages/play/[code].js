import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import PartyRoom from "../../components/party/PartyRoom";

export default function PlayPage({ mode, changeMode, location }) {
  const router = useRouter();
  const code = router.query.code ? String(router.query.code).toUpperCase() : null;

  useEffect(() => {
    // A shared /play/CODE link is often the very first page a visitor
    // hits - without this, a fresh visitor's background never gets set to
    // match the "dark" default the text colors assume (see the same fix on
    // movie/[id].js).
    changeMode(localStorage.getItem("mode") || "dark");
  }, []);

  return (
    <div>
      <Head>
        <title>Play as a Group - CouchBuddy</title>
        <meta name="robots" content="noindex" />
      </Head>
      {code && <PartyRoom code={code} mode={mode} location={location} />}
    </div>
  );
}
