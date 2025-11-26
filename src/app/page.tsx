"use client";

import { useState } from "react";
import { useProgramStore } from "@/store/programSore";

import AddProgramModal from "@/components/AddProgramModal";
import AddModuleModal from "@/components/AddModuleModal";
import ModuleTable from "@/components/ModuleTable";

import styles from "./Home.module.css";

export default function CurriculumPage() {
  const { programs, removeProgram } = useProgramStore();

  const [showAddProgram, setShowAddProgram] = useState(false);
  const [showAddModule, setShowAddModule] = useState<null | string>(null);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>სასწავლო გეგმა</h1>
      <p className={styles.subtitle}>
        თქვენ შეგიძლიათ დაამატოთ, შეცვალოთ ან წაშალოთ სასწავლო პროგრამები
      </p>

      <button
        className={styles.addButton}
        onClick={() => setShowAddProgram(true)}
      >
        + პროგრამის დამატება
      </button>

      {showAddProgram && (
        <AddProgramModal onClose={() => setShowAddProgram(false)} />
      )}

      <div className={styles.programList}>
        {programs.length === 0 ? (
          <p>სასწავლო პროგრამები ჯერ არ არის დამატებული.</p>
        ) : (
          programs.map((program) => (
            <div key={program.id} className={styles.programCard}>
              <div className={styles.programHeader}>
                <h2 className={styles.programName}>{program.name}</h2>
                <button
                  className={styles.deleteProgram}
                  onClick={() => removeProgram(program.id)}
                >
                  წაშლა
                </button>
              </div>

              <button
                className={styles.addModuleButton}
                onClick={() => setShowAddModule(program.id)}
              >
                + მოდულის დამატება
              </button>

              {showAddModule === program.id && (
                <AddModuleModal
                  programId={program.id}
                  onClose={() => setShowAddModule(null)}
                />
              )}

              <ModuleTable program={program} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
