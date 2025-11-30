"use client";

import { CurriculumProgram, Module } from "@/types/program";
import { getWeekLabels } from "@/lib/dateUtils";
import styles from "./ModuleTable.module.css";
import ModuleRow from "./ModuleRow";
import * as XLSX from "xlsx";
import { useState } from "react";
import { useProgramStore } from "@/store/programSore";

export default function ModuleTable({
  program,
}: {
  program: CurriculumProgram;
}) {
  const { updateModule } = useProgramStore();
  const weeks = program.totalWeeks;
  const weekLabels = getWeekLabels(
    program.startDate,
    Array.from({ length: weeks }, (_, i) => i)
  );

  type ModuleOverrides = Record<string, Record<number, number>>;

  function distributeEvenly(
    total: number,
    duration: number
  ): Record<number, number> {
    const base = Math.floor(total / duration);
    const remainder = total % duration;
    const result: Record<number, number> = {};

    for (let i = 1; i <= duration; i++) {
      result[i] = base + (i <= remainder ? 1 : 0);
    }

    return result;
  }

  const [overrides, setOverrides] = useState<ModuleOverrides>(() =>
    Object.fromEntries(
      program.modules.map((m) => {
        const dist = distributeEvenly(
          m.contactHours + m.assessmentHours,
          m.durationWeeks
        );
        return [m.id, { ...dist, ...m.weeklyOverrides }];
      })
    )
  );

  const updateWeek = (moduleId: string, week: number, value: string) => {
    const num = parseInt(value, 10) || 0;
    setOverrides((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [week]: num,
      },
    }));
  };

  const saveOverrides = (moduleId: string) => {
    const modulE = program.modules.find((m) => m.id === moduleId);
    if (!modulE) return;

    const updatedWeekly = overrides[moduleId];

    const updatedModule: Module = {
      ...modulE,
      weeklyOverrides: { ...updatedWeekly },
    };

    updateModule(program.id, updatedModule);

    setOverrides((prev) => ({
      ...prev,
      [moduleId]: updatedWeekly,
    }));
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th rowSpan={2}>კოდი</th>
            <th rowSpan={2}>სახელი</th>
            <th rowSpan={2}>ტიპი</th>
            <th rowSpan={2}>სულ</th>
            <th rowSpan={2}>კონტ.</th>
            <th rowSpan={2}>დამოუკიდ.</th>
            <th rowSpan={2}>შეფას.</th>
            <th rowSpan={2}>კვირები</th>
            <th rowSpan={2}>კრედიტი</th>
            {Array.from({ length: weeks }).map((_, i) => (
              <th key={i} className="weeknumbers">
                კვ.{i + 1}
              </th>
            ))}
          </tr>
          <tr>
            {weekLabels.map((label, i) => (
              <th key={i} className={styles.weekdays}>
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {program.modules.map((m) => (
            <ModuleRow
              key={m.id}
              module={m}
              totalWeeks={weeks}
              weekly={overrides[m.id]}
              onWeekChange={updateWeek}
              onSave={saveOverrides}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
