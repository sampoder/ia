import { GetServerSideProps } from "next";
import Nav from "../components/nav";
import { User as UserType } from "@prisma/client";
import Link from "next/link";

export default function Profile(props: { user: UserType | undefined }) {
  return (
    <>
      <Nav user={props.user} />
      <div className="formHolder">
        <h1 className="formHeader">Edit Your Profile</h1>
        <form action="/api/update" method="POST" className="flexFormWrapper">
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
          <Link href="/api/logout">
            <button type="button" className="logout">
              Logout
            </button>
          </Link>
        </form>
      </div>
      <style>
        {`.logout {
            background: var(--red)
          }`}
      </style>
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
