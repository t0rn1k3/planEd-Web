"use client";

import { useProgramStore } from "@/store/programSore";
import { v4 as uuid } from "uuid";

import styles from "./CurriculumPage.module.css";

export default function CurriculumPage() {
  const { programs, addProgram, removeProgram } = useProgramStore();
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>სასწავლო გეგმა</h1>
      <p className={styles.subtitle}>
        თქვენ შეგიძლიათ დაამატოთ, შეცვალოთ ან წაშალოთ სასწავლო პროგრამები
      </p>
      <button
        className={styles.addButton}
        onClick={() =>
          addProgram({
            id: uuid(),
            name: `ახალი პროგრამა ${programs.length + 1}`,
            totalWeeks: 12,
            startDate: new Date().toISOString(),
            holidays: [],
            modules: [],
          })
        }
      >
        + პროგრამის დამატება
      </button>
      <div className={styles.programList}>
        {programs.length === 0 ? (
          <p>სასწავლო პროგრამა ჯერ არ არის დამატებული</p>
        ) : (
          <ul>
            {programs.map((p) => (
              <li key={p.id}>
                {p.name} - {p.totalWeeks} კვირა
                <button onClick={() => removeProgram(p.id)}>წაშლა</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
