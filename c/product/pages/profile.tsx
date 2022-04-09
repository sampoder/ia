import { GetServerSideProps } from "next";
import Nav from "../components/nav";
import { User as UserType } from "@prisma/client";
import { useState } from "react";

type HTMLElementEvent<T extends HTMLElement> = Event & {
  value: T;
};

export default function EventNew(props: { user: UserType | undefined }) {
  return (
    <>
      <Nav user={props.user} />
      <div style={{ width: "600px", margin: "auto" }}>
        <h1 style={{ margin: "16px 0px" }}>Edit Your Profile</h1>
        <form
          action="/api/update"
          method="POST"
          style={{ display: "flex", flexDirection: "column", gap: "8px" }}
        >
          <small>First Name: </small>
          <input
            required
            name="firstName"
            defaultValue={props.user?.firstName}
          />
          <small>Last Name: </small>
          <input required name="lastName" defaultValue={props.user?.lastName} />
          <small>Email: </small>
          <input required name="email" defaultValue={props.user?.email} />
          <small>
            Looking to update your avatar? We use avatars from{" "}
            <a href="https://en.gravatar.com" target="_blank">
              Gravatar
            </a>
            .
          </small>
          <button>Save</button>
        </form>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { fetchUser } = require("./api/user");
  const { res } = context;
  let user = await fetchUser(context.req.cookies["auth"]);
  if (user == null) {
    res.setHeader("location", "/login");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }
  return { props: { user } };
};
