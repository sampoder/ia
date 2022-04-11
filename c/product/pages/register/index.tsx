import { GetServerSideProps } from "next";
import Nav from "../../components/nav";

export default function Register() {
  return (
    <>
      <Nav user={undefined} />
      <div className="formHolder">
        <h1 className="formHeader">Register</h1>
        <form action="/api/register" method="POST" className="flexFormWrapper">
          <small>Email: </small>
          <input name="email" />
          <small>First Name: </small>
          <input name="firstName" />
          <small>Last Name: </small>
          <input name="lastName" />
          <button>Register</button>
        </form>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { fetchUser } = require("../api/user");
  const { res } = context;
  let user = await fetchUser(context.req.cookies["auth"]);
  if (user != null) {
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }
  return { props: {} };
};
