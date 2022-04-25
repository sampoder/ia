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
            {!tab ? "Admin Dashboard" : "Tab Configuration"}
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
                <Link href={`/event/${props.slug}/admin/tab/configuration`}>
                  Tab Configuration
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
                <Link href={`/event/${props.slug}/admin/tab/configuration`}>
                  General
                </Link>
              </div>
              <div>
                <Link href={`/event/${props.slug}/admin/tab/motions`}>
                  Motions
                </Link>
              </div>
              <div>
                <Link href={`/event/${props.slug}/admin/tab/adjudicators`}>
                  Adjudicators
                </Link>
              </div>
              <div>
                <Link href={`/event/${props.slug}/admin/tab/rooms`}>
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
