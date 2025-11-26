"use client";

import { useProgramStore } from "@/store/programSore";
import { useState } from "react";
import AddProgramModal from "@/components/AddProgramModal";
import AddModuleModal from "@/components/AddModuleModal";
import ModuleTable from "@/components/ModuleTable";
import styles from "./CurriculumPage.module.css";

export default function CurriculumPage() {
  const { programs, removeProgram } = useProgramStore();
  const [showAddProgram, setShowAddProgram] = useState(false);
  const [openModuleFor, setOpenModuleFor] = useState<string | null>(null);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>სასწავლო გეგმა</h1>

      <button
        className={styles.addButton}
        onClick={() => setShowAddProgram(true)}
      >
        + პროგრამის დამატება
      </button>

      {showAddProgram && (
        <AddProgramModal onClose={() => setShowAddProgram(false)} />
      )}

      {openModuleFor && (
        <AddModuleModal
          programId={openModuleFor}
          onClose={() => setOpenModuleFor(null)}
        />
      )}

      {programs.length === 0 ? (
        <p>პროგრამები არ არის დამატებული</p>
      ) : (
        <div className={styles.programList}>
          {programs.map((p) => (
            <div key={p.id} className={styles.programCard}>
              <div className={styles.programHeader}>
                <h2>{p.name}</h2>
                <button onClick={() => removeProgram(p.id)}>წაშლა</button>
                <button onClick={() => setOpenModuleFor(p.id)}>+ მოდული</button>
              </div>

              <ModuleTable program={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
