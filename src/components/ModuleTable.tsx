"use client";

import { CurriculumProgram, Module } from "@/types/program";
import { getWeekLabels } from "@/lib/dateUtils";
import styles from "./ModuleTable.module.css";
import ModuleRow from "./ModuleRow";
import { useState, useEffect } from "react";
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
    duration: number,
    startWeek: number
  ): Record<number, number> {
    const base = Math.floor(total / duration);
    const remainder = total % duration;
    const result: Record<number, number> = {};

    // Set weeks before startWeek to 0
    for (let i = 1; i < startWeek; i++) {
      result[i] = 0;
    }

    // Distribute hours starting from startWeek
    for (let i = 0; i < duration; i++) {
      const week = startWeek + i;
      result[week] = base + (i < remainder ? 1 : 0);
    }

    return result;
  }

  const [overrides, setOverrides] = useState<ModuleOverrides>(() =>
    Object.fromEntries(
      program.modules.map((m) => {
        const dist = distributeEvenly(
          Number(m.contactHours) + Number(m.assessmentHours),
          m.durationWeeks,
          m.startWeek ?? 1
        );
        return [m.id, { ...dist, ...m.weeklyOverrides }];
      })
    )
  );

  // Update overrides when modules are added or removed
  useEffect(() => {
    setOverrides((prev) => {
      const newOverrides: ModuleOverrides = { ...prev };
      const moduleIds = new Set(program.modules.map((m) => m.id));

      // Remove overrides for deleted modules
      Object.keys(newOverrides).forEach((id) => {
        if (!moduleIds.has(id)) {
          delete newOverrides[id];
        }
      });

      // Add overrides for new modules
      program.modules.forEach((m) => {
        if (!newOverrides[m.id]) {
          const dist = distributeEvenly(
            Number(m.contactHours) + Number(m.assessmentHours),
            m.durationWeeks,
            m.startWeek ?? 1
          );
          newOverrides[m.id] = { ...dist, ...m.weeklyOverrides };
        }
      });

      return newOverrides;
    });
  }, [program.modules]);

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
            <th rowSpan={2} style={{ color: "initial" }}>კოდი</th>
            <th rowSpan={2} style={{ color: "initial" }}>სახელი</th>
            <th rowSpan={2} style={{ color: "initial" }}>ტიპი</th>
            <th rowSpan={2} style={{ color: "initial" }}>სულ</th>
            <th rowSpan={2} style={{ color: "initial" }}>კონტ.</th>
            <th rowSpan={2} style={{ color: "initial" }}>დამოუკიდ.</th>
            <th rowSpan={2} style={{ color: "initial" }}>შეფას.</th>
            <th rowSpan={2} style={{ color: "initial" }}>კვირები</th>
            <th rowSpan={2} style={{ color: "initial" }}>კრედიტი</th>
            {Array.from({ length: weeks }).map((_, i) => (
              <th key={i} className="weeknumbers" style={{ color: "initial" }}>
                კვ.{i + 1}
              </th>
            ))}
          </tr>
          <tr>
            {weekLabels.map((label, i) => (
              <th key={i} className={styles.weekdays} style={{ color: "initial" }}>
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {program.modules.map((m, index) => (
            <ModuleRow
              key={m.id}
              module={m}
              totalWeeks={weeks}
              weekly={overrides[m.id]}
              onWeekChange={updateWeek}
              onSave={saveOverrides}
              colorIndex={index % 3}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
