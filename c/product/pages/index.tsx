import { GetServerSideProps } from "next";
import { User as UserType, Tournament as TournamentType } from "@prisma/client";
import { useState } from "react";
import styles from "../styles/index.module.css";
import Nav from "../components/nav";
import Header from "../components/home/header";
import Event from "../components/event";
import search from "../lib/methods/search";

type HTMLElementEvent<T extends HTMLElement> = Event & {
  value: T;
};

export default function Home(props: {
  user: UserType | undefined;
  tournaments: TournamentType[] | undefined;
  participating: TournamentType[];
}) {
  const [query, setQuery] = useState("");
  return (
    <div>
      <Nav user={props.user || undefined} />
      <Header />
      <div className={styles.wrapper}>
        <h2>Your Tournaments</h2>
      </div>
      <div className={styles.events}>
        {props.participating.map((tournament) => (
          <Event tournament={tournament} key={tournament.id} />
        ))}
      </div>
      <div className={styles.wrapper} id="tournaments">
        <h2>Discover Tournaments</h2>
        <input
          className={styles.input}
          placeholder="Search / filter events"
          onChange={(e) =>
            setQuery(
              (e.target as HTMLElementEvent<HTMLInputElement>).value.toString()
            )
          }
        />
      </div>
      
      <div className={styles.events}>
        {search(props.tournaments ? props.tournaments : [], query)?.map(
          (tournament) => (
            <Event tournament={tournament} key={tournament.id} />
          )
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { fetchUser } = require("./api/user");
  const { prisma } = require("../lib/prisma");
  let tournaments = await prisma.tournament.findMany();
  let participating = [];
  let user = await fetchUser(context.req.cookies["auth"]);
  if (user != null) {
    participating = await prisma.tournament.findMany({
      where: {
        OR: [
          {
            participatingTeams: {
              some: {
                members: {
                  some: {
                    userId: user.id,
                  },
                },
              },
            },
          },
          {
            organisers: {
              some: {
                organiserId: user.id,
              },
            },
          },
        ],
      },
    });
  }
  return { props: { user, tournaments, participating } };
};
