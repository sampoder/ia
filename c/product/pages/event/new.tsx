import { GetServerSideProps } from "next";
import Nav from "../../components/nav";
import { User as UserType } from '@prisma/client'

export default function EventNew(props: {user: UserType | undefined}) {
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
          <input name="name" />
          <small>Slug: </small>
          <input name="slug" />
          <small>Starting Date / Time: </small>
          <input type="datetime-local" name="startingDate" />
          <small>Ending Date / Time: </small>
          <input type="datetime-local" name="endingDate" />
          <small>Type of event: </small>
          <div>
            <input type="radio" name="type" value="in-person" />
            <label htmlFor="in-person">In-Person</label>
          </div>
          <div>
            <input type="radio" name="type" value="virtual" />
            <label htmlFor="virtual">Virtual</label>
          </div>
          <button>Register</button>
        </form>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { fetchUser } = require('../api/user');
  let user = await fetchUser(context.req.cookies["auth"])
  return { props: {user}}
}
