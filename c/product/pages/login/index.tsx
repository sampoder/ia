import { GetServerSideProps } from "next";
import Nav from "../../components/nav";

export default function Signup() {
  return (
    <>
      <Nav user={undefined} />
      <div className="formHolder">
        <h1 className="formHeader">Login</h1>
        <form action="/api/login" method="POST" className="flexFormWrapper">
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
