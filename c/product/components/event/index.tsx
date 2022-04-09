import styles from "./styles.module.css";
import { Tournament as TournamentType } from "@prisma/client";
import Link from "next/link";

export default function Event(props: { tournament: TournamentType }) {
  return (
    <Link href={"/event/" + props.tournament.slug}>
      <div className={styles.event}>
        <img src={props.tournament.avatar} />
        <div>
          <h2>{props.tournament.name}</h2>
          {props.tournament.startingDate.toLocaleDateString() ==
          props.tournament.endingDate.toLocaleDateString() ? (
            props.tournament.startingDate.toLocaleDateString()
          ) : (
            <>Starts {props.tournament.startingDate.toLocaleDateString()}</>
          )}{" "}
          ∙ {props.tournament.prizeValue} in prizes ∙{" "}
          {props.tournament.online
            ? props.tournament.timezone
            : props.tournament.hostRegion}{" "}
          {props.tournament.online && <>(Virtual)</>} ∙{" "}
          {props.tournament.format}
        </div>
      </div>
    </Link>
  );
}
