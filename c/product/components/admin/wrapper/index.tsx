import React, { ReactChildren, ReactChild } from "react";
import Link from "next/link";
import styles from "./styles.module.css";

export default function AdminWrapper(props: {
  children: ReactChild | ReactChildren;
  slug: string;
  name: string;
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.sideBar}>
        <div className={styles.navigation}>
          <b>{props.name}</b>
          <h3 className={styles.adminTitle}>Admin Dashboard</h3>
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
          </div>
        </div>
      </div>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
}
