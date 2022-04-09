import { GetServerSideProps } from "next";
import Nav from "../../components/nav";
import { User as UserType } from "@prisma/client";
import { useState } from "react";

type HTMLElementEvent<T extends HTMLElement> = Event & {
  value: T;
};

export default function EventNew(props: { user: UserType | undefined }) {
  const [isInPerson, setIsInPerson] = useState(false);
  return (
    <>
      <Nav user={props.user} />
      <div style={{ width: "600px", margin: "auto" }}>
        <h1 style={{ margin: "16px 0px" }}>Start A New Event</h1>
        <form
          action="/api/event/new"
          method="POST"
          style={{ display: "flex", flexDirection: "column", gap: "8px" }}
        >
          <small>Name: </small>
          <input required name="name" />
          <small>Slug: </small>
          <input required name="slug" />
          <small>Tournament Logo URL: </small>
          <input required name="avatar" />
          <small>Tournament Format (eg. Asian Parliamentary, Custom): </small>
          <input required name="format" />
          <small>Starting Date / Time: </small>
          <input required type="datetime-local" name="startingDate" />
          <small>Ending Date / Time: </small>
          <input required type="datetime-local" name="endingDate" />
          <small>Type of event: </small>
          <select
          required
            onChange={(e) =>
              setIsInPerson(
                (e.target as HTMLElementEvent<HTMLSelectElement>).value ==
                  "in-person"
                  ? true
                  : false
              )
            }
          >
            <option value="" selected>
              Select an event type...
            </option>
            <option value="in-person">In-Person</option>
            <option value="virtual">Virtual</option>
          </select>
          {isInPerson &&<> <small>Host City: </small>
          <input required name="hostRegion" /></>}
          {!isInPerson &&<> <small>Focus Region (eg. South East Asia or Europe or GMT+8): </small>
          <input required name="hostRegion" /></>}
          <button>Start Your Debate Tournament</button>
        </form>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { fetchUser } = require("../api/user");
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
