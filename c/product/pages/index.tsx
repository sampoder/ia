import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Nav from "../components/nav";
import Header from "../components/home/header";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import { User as UserType, Tournament as TournamentType } from "@prisma/client";

export default function Home(props: {
  user: UserType | undefined;
  tournaments: TournamentType[] | undefined;
}) {
  return (
    <div>
      <Nav user={props.user || undefined} />
      <Header />
      {props.tournaments?.map(tournament => (
        <div>
          {tournament.name} / {tournament.startingDate.toUTCString()} to {tournament.endingDate.toUTCString()}
        </div>
      ))}
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
