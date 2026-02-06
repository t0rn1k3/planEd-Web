"use client";

import { useState } from "react";
import styles from "./TimetablePage.module.css";
import { useTimetableStore } from "@/store/timetableStore";

export default function TimetablePage() {
  const { teachers, addTeacher, removeTeacher } = useTimetableStore();
  const [teacherName, setTeacherName] = useState("");

  const handleAddTeacher = () => {
    if (!teacherName.trim()) return;
    addTeacher(teacherName);
    setTeacherName("");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>საათობრივი ბადე</h1>
      <p className={styles.subtitle}>
        შეიყვანეთ სკოლის ყველა მასწავლებელი.
      </p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>მასწავლებლების სია</h2>
        <div className={styles.formRow}>
          <input
            className={styles.input}
            placeholder="მასწავლებლის სახელი"
            value={teacherName}
            onChange={(event) => setTeacherName(event.target.value)}
          />
          <button className={styles.button} onClick={handleAddTeacher}>
            დამატება
          </button>
        </div>

        {teachers.length === 0 ? (
          <p className={styles.mutedText}>
            მასწავლებლები ჯერ არ არის დამატებული.
          </p>
        ) : (
          <ul className={styles.list}>
            {teachers.map((teacher) => (
              <li key={teacher.id} className={styles.listItem}>
                <span>{teacher.name}</span>
                <button
                  className={styles.buttonDanger}
                  onClick={() => removeTeacher(teacher.id)}
                >
                  წაშლა
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
