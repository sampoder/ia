import { GetServerSideProps } from "next";
import Nav from "../../../components/nav";
import {
  PrismaClient,
  User as UserType,
  Tournament as TournamentType,
  Team as TeamType,
} from "@prisma/client";
import Link from "next/link";
import { compile } from "@mdx-js/mdx";
import Markdown from "../../../components/markdown";
import styles from "./styles.module.css";

type ModifiedUserType = UserType & {
  user: UserType;
};

type ModifiedTeamType = TeamType & {
  members: ModifiedUserType[];
};

export default function Event(props: {
  user: UserType | undefined;
  tournament: TournamentType | undefined;
  description: string;
  team: ModifiedTeamType | null;
  organising: boolean;
}) {
  return (
    <>
      <Nav user={props.user} />
      <div
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(0, 0, 22, 0.8) 35%, rgba(0, 0, 18, 0.65) 100%), url(${
            props.tournament?.cover
              ? props.tournament.cover
              : `https://workshops.hackclub.com/api/patterns/${props.tournament?.slug}/`
          })`,
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
                {props.tournament?.endingDate.toLocaleTimeString()}
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
            {" "}
            {props.tournament?.online ? (
              <>
                {props.tournament?.hostRegion} ∙ {props.tournament?.timezone}
              </>
            ) : (
              <>{props.tournament?.hostRegion}</>
            )}
          </h2>
        </div>

        <div
          style={{
            background:
              props.team != undefined
                ? "rgba(44, 187, 144, 0.3)"
                : "rgba(100, 100, 100, 0.1)",
            padding: "16px",
            width: "calc(40vw - 64px)",
            borderRadius: "var(--radii-small)",
          }}
        >
          {" "}
          {props.team != undefined ? (
            <div style={{ color: "white", lineHeight: "1.6" }}>
              ✅ You're registered for {props.tournament?.name} with{" "}
              {props.team.name}:{" "}
              {props.team.members.map((member, index) => (
                <span key={`team-member-${index}`}>
                  {member.user.firstName +
                    " " +
                    member.user.lastName + //@ts-ignore
                    (index != props.team.members.length - 1 //@ts-ignore
                      ? index == props.team.members.length - 2 //@ts-ignore
                        ? " & "
                        : ", "
                      : "")}
                </span>
              ))}
              .<br />
              <button>Join Discord</button>
              <button style={{ margin: "6px 8px 0px" }}>View Tab</button>
              <Link
                href={`/api/event/${props.tournament?.slug}/${props.team?.id}/deregister`}
              >
                <button style={{ background: "var(--red)" }}>Deregister</button>
              </Link>
            </div>
          ) : (
            <form
              action={`/api/event/${props.tournament?.slug}/register`}
              method="POST"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <input
                name="name"
                placeholder="Your Team Name"
                disabled={props.user == null || props.organising}
                style={{
                  opacity: props.user != null && !props.organising ? 1 : 0.6,
                }}
              />
              <small
                style={{
                  fontWeight: "bold",
                  color: "white",
                  opacity: props.user != null && !props.organising ? 1 : 0.6,
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
                    disabled={props.user == null || props.organising}
                    style={{
                      opacity:
                        props.user != null && !props.organising ? 1 : 0.6,
                    }}
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
                <button
                  disabled={props.organising}
                  style={
                    props.organising
                      ? {
                          opacity: 0.6,
                          pointerEvents: "none",
                        }
                      : {}
                  }
                >
                  Register {props.organising && <>(disabled for organisers)</>}
                </button>
              )}
            </form>
          )}
        </div>
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
        <div>
          <div
            style={{
              background: "var(--sunken)",
              padding: "16px",
              borderRadius: "var(--radii-small)",
            }}
            className={styles.details}
          >
            <div>
              <b>Timezone:</b> {props.tournament?.timezone}
            </div>
            <div>
              <b>Starts at:</b>{" "}
              {props.tournament?.startingDate.toLocaleDateString()}{" "}
              {props.tournament?.startingDate.toLocaleTimeString()}
            </div>
            <div>
              <b>Ends at:</b>{" "}
              {props.tournament?.endingDate.toLocaleDateString()}{" "}
              {props.tournament?.endingDate.toLocaleTimeString()}
            </div>
            {!props.tournament?.online && (
              <div>
                <b>Venue:</b> {props.tournament?.venueAddress}
              </div>
            )}
            <div>
              <b>Format:</b> {props.tournament?.format}
            </div>
            <div>
              <b>Prize value:</b> {props.tournament?.prizeValue}
            </div>
            <div>
              <b>Eligibility:</b> {props.tournament?.eligibility}
            </div>
            <div>
              <b>Organised by:</b> {props.tournament?.organisedBy}
            </div>
            <div>
              Questions?{" "}
              <a href={`mailto:${props.tournament?.managerEmail}`}>
                <b>Email the tournament manager.</b>
              </a>
            </div>
            {props.organising && (
              <div>
                <Link href={`/event/${props.tournament?.slug}/admin/configure`}>
                  <button>Edit Tournament Details</button>
                </Link>
                <br />
                <Link href={`/event/${props.tournament?.slug}/admin/team`}>
                  <button>Manage Organising Team</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { fetchTournament } = require("../../api/event/[slug]/index");
  const { fetchUser } = require("../../api/user");
  const { prisma: PrismaClient } = require("../../../lib/prisma");
  let user = await fetchUser(context.req.cookies["auth"]);
  let tournament = await fetchTournament(context.params?.slug);
  let teams = user?.id
    ? (await prisma?.team.findMany({
        where: {
          tournamentId: tournament.id,
          members: {
            some: {
              userId: user.id,
            },
          },
        },
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      })) || []
    : [];
  const description = String(
    await compile(
      tournament.description
        ? tournament.description
        : "More information coming soon!",
      {
        outputFormat: "function-body",
      }
    )
  );
  return {
    props: {
      tournament,
      user,
      description,
      team: teams[0] ? teams[0] : null,
      organising: user ? user.organisingTournaments // @ts-ignore
        .map((x) => x.tournamentId)
        .includes(tournament.id) : false,
    },
  };
};
