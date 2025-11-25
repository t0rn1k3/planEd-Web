"use client";

import styles from "./CurriculumPage.module.css";

export default function CurriculumPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>სასწავლო გეგმა</h1>
      <p className={styles.subtitle}>
        თქვენ შეგიძლიათ დაამატოთ, შეცვალოთ ან წაშალოთ სასწავლო პროგრამები
      </p>
      <button className={styles.addButton}>+ პროგრამის დამატება</button>
      <div className={styles.programList}>
        {/* Placeholder for future program cards */}
        <p>სასწავლო პროგრამები ჯერ არ არის დამატებული.</p>
      </div>
    </div>
  );
}
