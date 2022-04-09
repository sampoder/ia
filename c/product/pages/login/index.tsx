import { GetServerSideProps } from "next";
import Nav from "../../components/nav";

export default function Signup() {
  return (
    <>
      <Nav user={undefined} />
      <div style={{ width: "600px", margin: "auto" }}>
        <h1 style={{ margin: "16px 0px" }}>Sign Up</h1>
        <form
          action="/api/login"
          method="POST"
          style={{ display: "flex", flexDirection: "column", gap: "8px" }}
        >
          <small>Email: </small>
          <input name="email" />
          <button>Login</button>
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
