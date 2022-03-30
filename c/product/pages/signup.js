import Nav from "../components/nav";

export default function Signup() {
  return (
    <>
      <Nav />
      <div style={{ width: "600px", margin: "auto" }}>
        <h1 style={{ margin: "16px 0px" }}>Sign Up</h1>
        <form
          action="/api/register"
          method="POST"
          style={{ display: "flex", flexDirection: "column", gap: "8px" }}
        >
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
