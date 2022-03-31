import Nav from "../components/nav";

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
