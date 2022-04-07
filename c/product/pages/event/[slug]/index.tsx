import { GetServerSideProps } from "next";
import Nav from "../../../components/nav";
import { User as UserType, Tournament as TournamentType } from "@prisma/client";
import Link from "next/link";

export default function EventNew(props: {
  user: UserType | undefined;
  tournament: TournamentType | undefined;
}) {
  return (
    <>
      <Nav user={props.user} />
      <div style={{ width: "600px", margin: "auto" }}>
        {JSON.stringify(props.tournament)}
        <h1 style={{ margin: "16px 0px" }}>
          Register For {props.tournament?.name}
        </h1>
        {props.user == null ? (
          <Link href="/login">
            <button>Login To Join Tournament</button>
          </Link>
        ) : (
          <form
            action={`/api/event/${props.tournament?.slug}/register`}
            method="POST"
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            <small>Team Name: </small>
            <input name="name" />
            <small>Your Team Members' Emails: </small>
            {[...Array(3)].map((_, index) =>
              index != 0 ? (
                <input
                  placeholder={`Team Member ${index}'s Email`}
                  name={`email${index}`}
                />
              ) : (
                <></>
              )
            )}

            <button>Register</button>
          </form>
        )}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { fetchTournament } = require("../../api/event/[slug]/index");
  const { fetchUser } = require("../../api/user");
  let user = await fetchUser(context.req.cookies["auth"]);
  let tournament = await fetchTournament(context.params?.slug);
  return { props: { tournament, user } };
};
