import Link from "next/link";
import React, { ReactChildren, ReactChild } from "react";

export default function AdminWrapper(props: {
  children: ReactChild | ReactChildren;
  slug: string;
  name: string;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr" }}>
      <div style={{ padding: "32px" }}>
        <div
          style={{
            background: "var(--sunken)",
            padding: "16px",
            borderRadius: "var(--radii-small)",
          }}
        >
          <b>{props.name}</b>
          <h3 style={{ marginTop: "4px" }}>Admin Dashboard</h3>
          <div
            style={{
              marginTop: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div>
              <Link href={`/event/${props.slug}/admin/configure`}>
                Configure Event
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
      <div style={{ paddingTop: "16px", width: "600px", margin: "auto" }}>
        {props.children}
      </div>
    </div>
  );
}
