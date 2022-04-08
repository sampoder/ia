import { GetServerSideProps } from "next";
import Nav from "../../../components/nav";
import { User as UserType, Tournament as TournamentType } from "@prisma/client";
import Link from "next/link";
import { compile } from "@mdx-js/mdx";
import Markdown from "../../../components/markdown";

export default function Event(props: {
  user: UserType | undefined;
  tournament: TournamentType | undefined;
  description: string;
}) {
  return (
    <>
      <Nav user={props.user} />
      <div
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(0, 0, 22, 0.8) 35%, rgba(0, 0, 18, 0.65) 100%), url(https://i.imgur.com/mQTh5m3.jpg)`,
          backgroundPosition: "center",
          padding: "64px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ width: "calc(60vw - 64px)", minWidth: "fit-content" }}>
          <h1
            style={{
              background: "var(--blue)",
              padding: "8px 12px",
              color: "white",
              width: "fit-content",
              fontSize: "64px",
            }}
          >
            {props.tournament?.name}
          </h1>
          <h2
            style={{
              background: "var(--purple)",
              padding: "8px 12px",
              color: "white",
              width: "fit-content",
            }}
          >
            {props.tournament?.startingDate.toLocaleDateString() ==
            props.tournament?.endingDate.toLocaleDateString() ? (
              <>
                {props.tournament?.startingDate.toLocaleDateString()}{" "}
                {props.tournament?.startingDate.toLocaleTimeString()} to{" "}
                {props.tournament?.startingDate.toLocaleTimeString()}
              </>
            ) : (
              <>
                {props.tournament?.startingDate.toLocaleDateString()}{" "}
                {props.tournament?.startingDate.toLocaleTimeString()} to{" "}
                {props.tournament?.endingDate.toLocaleDateString()}{" "}
                {props.tournament?.endingDate.toLocaleTimeString()}
              </>
            )}
          </h2>
          <h2
            style={{
              background: "var(--green)",
              padding: "8px 12px",
              color: "white",
              width: "fit-content",
              marginBottom: "24px",
            }}
          >
            Virtual ∙ GMT+8
          </h2>
        </div>

        <form
          action={`/api/event/${props.tournament?.slug}/register`}
          method="POST"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            background: "rgba(100, 100, 100, 0.1)",
            padding: "16px",
            minWidth: "calc(40vw - 64px)",
            borderRadius: "var(--radii-small)",
          }}
        >
          <input
            name="name"
            placeholder="Your Team Name"
            disabled={props.user == null}
            style={{ opacity: props.user != null ? 1 : 0.6 }}
          />
          <small
            style={{
              fontWeight: "bold",
              color: "white",
              opacity: props.user != null ? 1 : 0.6,
            }}
          >
            Your Other Team Members' Emails:{" "}
          </small>
          {[...Array(3)].map((_, index) =>
            index != 0 ? (
              <input
                placeholder={`Team Member ${index}'s Email`}
                name={`email${index}`}
                key={`email${index}`}
                disabled={props.user == null}
                style={{ opacity: props.user != null ? 1 : 0.6 }}
              />
            ) : (
              <></>
            )
          )}
          {props.user == null ? (
            <Link href="/login">
              <button type="button">Login To Join Tournament</button>
            </Link>
          ) : (
            <button>Register</button>
          )}
        </form>
      </div>
      <div
        style={{
          padding: "32px 64px",
          display: "grid",
          gridTemplateColumns: "6fr 3fr",
          gap: "16px",
        }}
      >
        <div>
          <Markdown code={props.description} />
        </div>
        <div
          style={{
            background: "var(--sunken)",
            padding: "16px",
            borderRadius: "var(--radii-small)",
          }}
        >
          <div>Starts at:</div>
          <div> Ends at:</div>
          <div>Venue:</div>
          <div>Prize value:</div>
          <div>Eligibility:</div>
          <div>Organised by:</div>
          <div>Questions? Email the tournament manager</div>
          <div>Tell your friends <br />
          Twitter ~ Facebook ~ Reddit</div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { fetchTournament } = require("../../api/event/[slug]/index");
  const { fetchUser } = require("../../api/user");
  let user = await fetchUser(context.req.cookies["auth"]);
  let tournament = await fetchTournament(context.params?.slug);

  const description = String(
    await compile(
      tournament.description
        ? tournament.description
        : "More information coming soon!",
      {
        outputFormat: "function-body" /* …otherOptions */,
      }
    )
  );
  return { props: { tournament, user, description } };
};
