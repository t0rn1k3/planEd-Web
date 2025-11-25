"use client";

import { useState } from "react";
import { useProgramStore } from "@/store/programSore";
import { v4 as uuid } from "uuid";
import styles from "./AddProgramModal.module.css";

export default function AddProgramModal({ onClose }: { onClose: () => void }) {
  const { addProgram } = useProgramStore();

  const [name, setName] = useState("");
  const [weeks, setWeeks] = useState("");
  const [startDate, setStartDate] = useState("");

  const handleSubmitModule = () => {
    if (!name || !weeks || !startDate) return;

    addProgram({
      id: uuid(),
      name,
      totalWeeks: parseInt(weeks, 10),
      startDate,
      holidays: [],
      modules: [],
    });

    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>პროგრამის დამატება</h2>

        <div className={styles.modalField}>
          <label>სახელი</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.modalField}>
          <label>კვირების რაოდენობა</label>
          <input
            type="number"
            value={weeks}
            onChange={(e) => setWeeks(e.target.value)}
          />
        </div>

        <div className={styles.modalField}>
          <label>დაწყების თარიღი</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className={styles.modalActions}>
          <button className={styles.cancelButton} onClick={onClose}>
            გაუქმება
          </button>
          <button className={styles.confirmButton} onClick={handleSubmitModule}>
            დამატება
          </button>
        </div>
      </div>
    </div>
  );
}
