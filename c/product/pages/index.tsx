import Head from "next/head";
import Image from "next/image";
import styles from "../styles/index.module.css";
import Nav from "../components/nav";
import Header from "../components/home/header";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import { User as UserType, Tournament as TournamentType } from "@prisma/client";
import Link from "next/link";

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
          <Link href={"/event/" + tournament.slug}>
            <div className={styles.event}>
              <img src="https://www.gravatar.com/avatar/3a794f7bbeb6e5d4287debf1454ebcf5?d=identicon&r=pg" />
              <div>
                <h2>{tournament.name}</h2>
                {tournament.startingDate.toLocaleDateString() ==
                tournament.endingDate.toLocaleDateString() ? (
                  tournament.startingDate.toLocaleDateString()
                ) : (
                  <>
                    {tournament.startingDate.toLocaleDateString()} to{" "}
                    {tournament.endingDate.toLocaleDateString()}
                  </>
                )}{" "}
                ∙ $1,500 in prizes ∙ Singapore ∙ WSC
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { fetchUser } = require("./api/user");
  const { prisma } = require("../lib/prisma");
  const { res } = context;
  let tournaments = await prisma.tournament.findMany();
  let user = await fetchUser(context.req.cookies["auth"]);
  return { props: { user, tournaments } };
};
