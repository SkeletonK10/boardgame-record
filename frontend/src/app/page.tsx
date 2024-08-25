import { text } from "@/data";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        <h2>{text.main.title}</h2>
      </div>
    </main>
  );
}
