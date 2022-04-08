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
            <>
              {props.tournament.startingDate.toLocaleDateString()} to{" "}
              {props.tournament.endingDate.toLocaleDateString()}
            </>
          )}{" "}
          ∙ $1,500 in prizes ∙ Singapore ∙ WSC
        </div>
      </div>
    </Link>
  );
}
