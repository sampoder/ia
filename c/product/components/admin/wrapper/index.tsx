import React, { ReactChildren, ReactChild } from "react";
import Link from "next/link";
import styles from "./styles.module.css";

export default function AdminWrapper(props: {
  children: ReactChild | ReactChildren;
  slug: string;
  name: string;
  tab?: boolean | undefined;
}) {
  let tab = props.tab != undefined ? props.tab : false;
  return (
    <div className={styles.wrapper}>
      <div className={styles.sideBar}>
        <div className={styles.navigation}>
          <b>{props.name}</b>
          <h3 className={styles.adminTitle}>
            {!tab ? "Admin Dashboard" : "Tab Management"}
          </h3>
          {!tab && (
            <div className={styles.links}>
              <div>
                <Link href={`/event/${props.slug}/admin/configure`}>
                  Configure Event
                </Link>
              </div>
              <div>
                <Link href={`/event/${props.slug}/admin/attendees`}>
                  View Attendees
                </Link>
              </div>
              <div>
                <Link href={`/event/${props.slug}/admin/email`}>
                  Email Attendees
                </Link>
              </div>
              <div>
                <Link href={`/event/${props.slug}/admin/team`}>
                  Manage Organising Team
                </Link>
              </div>
              <div>
                <Link href={`/event/${props.slug}/admin/tab`}>
                  Tab Management
                </Link>
              </div>
            </div>
          )}
          {tab && (
            <div className={styles.links}>
              <div>
                <Link href={`/event/${props.slug}/admin/configure`}>
                ↪ Admin Dashboard
                </Link>
              </div>
              <div>
                <Link href={`/event/${props.slug}/admin/attendees`}>
                  Draw Rules
                </Link>
              </div>
              <div>
                <Link href={`/event/${props.slug}/admin/attendees`}>
                  Debate Rules
                </Link>
              </div>
              <div>
                <Link href={`/event/${props.slug}/admin/email`}>
                  Scoring Rules
                </Link>
              </div>
              <div>
                <Link href={`/event/${props.slug}/admin/email`}>
                  Standings
                </Link>
              </div>
              <div>
                <Link href={`/event/${props.slug}/admin/email`}>
                  Motions
                </Link>
              </div>
              <div>
                <Link href={`/event/${props.slug}/admin/team`}>
                  Tab Release
                </Link>
              </div>
              <div>
                <Link href={`/event/${props.slug}/admin/team`}>
                  Data Entry
                </Link>
              </div>
              <div>
                <Link href={`/event/${props.slug}/admin/team`}>
                  Notifications
                </Link>
              </div>
              <div>
                <Link href={`/event/${props.slug}/admin/team`}>
                  Adjudicators
                </Link>
              </div>
              <div>
                <Link href={`/event/${props.slug}/admin/team`}>
                  Rooms
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
}
