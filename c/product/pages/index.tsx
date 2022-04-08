import Head from "next/head";
import Image from "next/image";
import styles from "../styles/index.module.css";
import Nav from "../components/nav";
import Header from "../components/home/header";
import { GetServerSideProps } from "next";
import { User as UserType, Tournament as TournamentType } from "@prisma/client";
import Link from "next/link";
import Event from "../components/event";

export default function Home(props: {
  user: UserType | undefined;
  tournaments: TournamentType[] | undefined;
}) {
  return (
    <div>
      <Nav user={props.user || undefined} />
      <Header />
      <div className={styles.events}>
        {props.tournaments?.map((tournament) => (
          <Event tournament={tournament} />
        ))}
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
