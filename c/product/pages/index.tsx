import Head from "next/head";
import Image from "next/image";
import styles from "../styles/index.module.css";
import Nav from "../components/nav";
import Header from "../components/home/header";
import { GetServerSideProps } from "next";
import { User as UserType, Tournament as TournamentType } from "@prisma/client";
import Link from "next/link";
import Event from "../components/event";
import search from "../lib/methods/search";
import { useState } from "react";

type HTMLElementEvent<T extends HTMLElement> = Event & {
  value: T;
};

export default function Home(props: {
  user: UserType | undefined;
  tournaments: TournamentType[] | undefined;
}) {
  const [query, setQuery] = useState("");
  return (
    <div>
      <Nav user={props.user || undefined} />
      <Header />
      <div className={styles.inputWrapper}>
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
  let user = await fetchUser(context.req.cookies["auth"]);
  return { props: { user, tournaments } };
};
