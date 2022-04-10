import { GetServerSideProps } from "next";
import Nav from "../../../../components/nav";
import {
  User as UserType,
  Tournament as TournamentType,
  StripeAccount,
} from "@prisma/client";
import { Tournament, User } from "../../../../lib/classes";
import Link from "next/link";

type TournamentTypeWithStripeAccount = TournamentType & {
  stripeAccount: StripeAccount;
};

export default function EventNew(props: {
  user: UserType | undefined;
  tournament: TournamentTypeWithStripeAccount | undefined;
}) {
  return (
    <>
      <Nav user={props.user} />
      <div style={{ width: "600px", margin: "auto" }}>
        <h1 style={{ margin: "16px 0px" }}>Email Attendees</h1>
        <form
          action={`/api/event/${props.tournament?.slug}/admin/email`}
          method="POST"
          style={{ display: "flex", flexDirection: "column", gap: "8px" }}
        >
          <small>Email Subject: </small>
          <input
            name="subject"
            required
          />
          <small>Email Text: </small>
          <textarea
            name="text"
            required
          />
          <button>Send Email</button>
        </form>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { fetchTournament } = require("../../../api/event/[slug]/index");
  const { fetchUser } = require("../../../api/user");
  let user: User = await fetchUser(context.req.cookies["auth"]);
  const { res } = context;
  let tournament = await fetchTournament(context.params?.slug, {
    stripeAccount: true,
  }); //@ts-ignore
  tournament.organiserIDs = tournament.organisers.map((x) => x.organiserId);
  if (tournament.organiserIDs == null || user.id == null) {
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }
  if (!tournament.organiserIDs.includes(user.id)) {
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }
  console.log(tournament.stripeAccount);
  return { props: { tournament, user } };
};
