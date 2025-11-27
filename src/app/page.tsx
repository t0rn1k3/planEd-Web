"use client";
import { useRouter } from "next/navigation";
import styles from "./Home.module.css";

export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>აირჩიეთ გეგმა:</h2>

      <div className={styles.grid}>
        <div className={styles.card} onClick={() => router.push("/curriculum")}>
          <div className={styles.icon}>📘</div>
          <p className={styles.cardText}>სასწავლო გეგმა</p>
          <p className={styles.cardSubtext}>(კოლეჯები)</p>
        </div>

        <div className={styles.card} onClick={() => router.push("/timetable")}>
          <div className={styles.icon}>🕒</div>
          <p className={styles.cardText}>საათობრივი ბადე</p>
          <p className={styles.cardSubtext}>(სკოლები)</p>
        </div>
      </div>
    </div>
  );
}
