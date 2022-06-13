import { GetServerSideProps } from "next";
import Nav from "../../../components/nav";
import {
  User as UserType,
  Tournament as TournamentType,
  Team as TeamType,
  OrganiserTournamentRelationship,
  Adjudicator,
} from "@prisma/client";
import Link from "next/link";
import { compile } from "@mdx-js/mdx";
import Markdown from "../../../components/markdown";
import styles from "./styles.module.css";
import { zeroDecimalCurrencies } from "../../../lib/currencies";

type ModifiedUserType = UserType & {
  user: UserType;
};

type ModifiedTeamType = TeamType & {
  members: ModifiedUserType[];
};

const headerGradient = (tournament: TournamentType) => {
  return `linear-gradient(90deg, rgba(0, 0, 22, 0.8) 35%, rgba(0, 0, 18, 0.65) 100%), url(${
    tournament?.cover
      ? tournament.cover
      : `https://workshops.hackclub.com/api/patterns/${tournament?.slug}/`
  })`;
};

const registrationBoxBackground = (team: boolean) => {
  return team ? "rgba(44, 187, 144, 0.3)" : "rgba(100, 100, 100, 0.1)";
};

const inputOpacity = (user: UserType | undefined, organising: boolean) => {
  return user != undefined && !organising ? 1 : 0.6;
};

export default function Event(props: {
  user: UserType | undefined;
  tournament: TournamentType & {adjudicators: Adjudicator[]};
  description: string;
  team: ModifiedTeamType | null;
  organising: boolean;
  adjudicating: boolean;
}) {
  return (
    <>
      <Nav user={props.user} />
      <div
        style={{
          backgroundImage: headerGradient(props.tournament),
        }}
        className={styles.header}
      >
        <div className={styles.headerTitles}>
          <h1 className={styles.mainTitle}>{props.tournament?.name}</h1>
          <h2 className={styles.timingTitle}>
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
          <h2 className={styles.locationTitle}>
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
            background: registrationBoxBackground(props.team != undefined),
          }}
          className={styles.registrationBox}
        >
          {props.team != undefined ? (
            <div className={styles.registered}>
              ✅ You're registered for {props.tournament?.name} with{" "}
              {props.team.name}:{" "}
              {props.team.members.map((member, index) => (
                <span key={`team-member-${index}`}>
                  {member.user.firstName +
                    " " +
                    member.user.lastName +
                    (index != (props.team?.members?.length || 0) - 1
                      ? index == (props.team?.members?.length || 0) - 2
                        ? " & "
                        : ", "
                      : "")}
                </span>
              ))}
              .<br />
              <div className={styles.attendeeButtons}>
                {props.tournament.online &&
                  props.tournament.venueAddress != "TBC" &&
                  props.tournament.venueAddress != undefined && (
                    <Link href={props.tournament.venueAddress}>
                      <button>Join The Tournament</button>
                    </Link>
                  )}
                  <Link href={`/event/${props.tournament?.slug}/tab`}>
                <button className={styles.tabButton}>View Tab</button></Link>
                <Link
                  href={`/api/event/${props.tournament?.slug}/${props.team?.id}/deregister`}
                >
                  <button className={styles.deregister}>
                    Deregister {props.tournament?.price > 0 && "(no refunds)"}
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <form
              action={`/api/event/${props.tournament?.slug}/register`}
              method="POST"
              className="flexFormWrapper"
            >
              <input
                name="name"
                placeholder="Your Team Name"
                disabled={
                  props.user == null || props.organising || props.adjudicating
                }
                style={{
                  opacity: inputOpacity(
                    props.user,
                    props.organising || props.adjudicating
                  ),
                }}
              />
              <small
                className={styles.emailsLabel}
                style={{
                  opacity: inputOpacity(
                    props.user,
                    props.organising || props.adjudicating
                  ),
                }}
              >
                Your Other Team Members' Emails:{" "}
              </small>
              {[...Array(props.tournament.amountPerTeam + 1)].map(
                (_, index) =>
                  index != 0 && (
                    <input
                      placeholder={`Team Member ${index}'s Email`}
                      name={`email${index}`}
                      key={`email${index}`}
                      disabled={
                        props.user == null ||
                        props.organising ||
                        props.adjudicating
                      }
                      style={{
                        opacity: inputOpacity(
                          props.user,
                          props.organising || props.adjudicating
                        ),
                      }}
                    />
                  )
              )}
              {props.user == null ? (
                <Link href="/login">
                  <button type="button">Login To Join Tournament</button>
                </Link>
              ) : (
                <button
                  disabled={props.organising || props.adjudicating}
                  style={
                    props.organising || props.adjudicating
                      ? {
                          opacity: 0.6,
                          pointerEvents: "none",
                        }
                      : {}
                  }
                >
                  {props.tournament?.price == 0 && (
                    <>
                      Register{" "}
                      {props.organising && <>(disabled for organisers)</>}
                      {props.adjudicating && <>(disabled for adjudicators)</>}
                    </>
                  )}
                  {props.tournament?.price != 0 && (
                    <>
                      Proceed to Checkout ({props.tournament?.priceISOCode}{" "}
                      {props.tournament?.price *
                        (zeroDecimalCurrencies.includes(
                          props.tournament?.priceISOCode
                        )
                          ? 1
                          : 0.01)}
                      ) {props.organising && <>(disabled for organisers)</>}
                      {props.adjudicating && <>(disabled for adjudicators)</>}
                    </>
                  )}
                </button>
              )}
            </form>
          )}
        </div>
      </div>
      <div className={styles.content}>
        <div>
          <Markdown code={props.description} />
        </div>
        <div>
          <div className={styles.details}>
            {props.tournament?.online && (
              <div>
                <b>Timezone:</b> {props.tournament?.timezone}
              </div>
            )}
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
                  <button style={{ marginRight: "8px" }}>
                    Admin Dashboard
                  </button>
                </Link>
                <Link href={`/event/${props.tournament?.slug}/tab`}>
                  <button>Tab</button>
                </Link>
              </div>
            )}
            {props.adjudicating && (
              <div>
                <Link href={`/event/${props.tournament?.slug}/tab/scoring/${props.tournament.adjudicators.filter(x=> x.userId == props.user?.id)[0].id}`}>
                  <button style={{ marginRight: "8px" }}>
                    Adjudicator Dashboard
                  </button>
                </Link>
                <Link href={`/event/${props.tournament?.slug}/tab`}>
                  <button>Tab</button>
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
  const { res } = context;
  let user = await fetchUser(context.req.cookies["auth"]);
  let tournament = await fetchTournament(context.params?.slug);
  if (tournament == undefined) {
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }
  let teams = user?.id
    ? (await prisma?.team.findMany({
        where: {
          tournamentId: tournament.id,
          members: {
            some: {
              userId: user.id,
            },
          },
          paid: true,
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
      organising: user
        ? user.organisingTournaments
            .map((x: OrganiserTournamentRelationship) => x.tournamentId)
            .includes(tournament.id)
        : false,
      adjudicating: user
        ? tournament.adjudicators
            .map((adj: Adjudicator) => adj.userId)
            .includes(user.id)
        : false,

    },
  };
};
