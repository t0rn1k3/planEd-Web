"use client";

import { Module } from "@/types/program";
import styles from "./ModuleItem.module.css";

interface ModuleItemProps {
  module: Module;
  onDelete: (id: string) => void;
}

export default function ModuleItem({ module, onDelete }: ModuleItemProps) {
  // Convert weeklyOverrides object → array in correct order
  const weeksArray: number[] = Object.values(module.weeklyOverrides || {});

  return (
    <div className={styles.item}>
      <div className={styles.headerRow}>
        <div className={styles.title}>{module.name}</div>

        <div
          className={`${styles.typeBadge} ${
            module.type === "professional"
              ? styles.typeProfessional
              : styles.typeGeneral
          }`}
        >
          {module.type === "professional" ? "პროფესიული" : "ზოგადი"}
        </div>
      </div>

      <div className={styles.infoGrid}>
        <div>
          სულ:{" "}
          {module.contactHours +
            module.independentHours +
            module.assessmentHours}
        </div>
        <div>საკონტ.: {module.contactHours}</div>
        <div>შეფას.: {module.assessmentHours}</div>
      </div>

      <div className={styles.weeksBlock}>
        <div className={styles.weeksTitle}>კვირეული დაგეგმვა</div>

        <div className={styles.weeksRow}>
          {weeksArray.map((h: number, i: number) => (
            <div key={i} className={styles.weekCell}>
              {h}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.deleteBtn}
          onClick={() => onDelete(module.id)}
        >
          წაშლა
        </button>
      </div>
    </div>
  );
}
