import styles from "./styles.module.css";
import Button from "../../button";

export default function Header() {
  return (
    <div className={styles.header}>
      <div>
        <h1 style={{ fontSize: "3.5em", maxWidth: "800px" }}>
          Welcome To A Global<br />  Debating Community
        </h1>
        <p>
          <Button style={{marginRight: '10px'}}>Join a Tournament</Button>
          <Button>Organise a Tournament</Button>
        </p>
      </div>
    </div>
  );
}
