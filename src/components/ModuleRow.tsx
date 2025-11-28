"use client";

import { useState } from "react";
import { Module } from "@/types/program";
import styles from "./ModuleRow.module.css";

type Props = {
  module: Module;
  totalWeeks: number;
};

const typeLabels: Record<Module["type"], string> = {
  professional: "დარგობრივი",
  general: "ზოგადი",
  commonProfessional: "საერთო დარგობრივი",
  integratedGeneral: "ინტეგრირებული ზოგადი",
};

export default function ModuleRow({ module, totalWeeks }: Props) {
  const totalRequired = module.contactHours + module.assessmentHours;

  const [weekly, setWeekly] = useState<Record<number, number>>({
    ...module.weeklyOverrides,
  });

  const sum = Object.values(weekly).reduce((acc, v) => acc + v, 0);
  const isInvalid = sum !== totalRequired;

  const updateWeek = (week: number, value: string) => {
    const num = parseInt(value, 10) || 0;
    setWeekly((prev) => ({ ...prev, [week]: num }));
  };

  return (
    <tr>
      <td>{module.code}</td>
      <td>{module.name}</td>
      <td>{typeLabels[module.type]}</td>

      <td style={{ color: isInvalid ? "red" : undefined }}>
        {module.contactHours + module.independentHours + module.assessmentHours}
      </td>
      <td style={{ color: isInvalid ? "red" : undefined }}>
        {module.contactHours}
      </td>
      <td>{module.independentHours}</td>
      <td style={{ color: isInvalid ? "red" : undefined }}>
        {module.assessmentHours}
      </td>
      <td>{module.durationWeeks}</td>
      <td>{module.credits}</td>

      {Array.from({ length: totalWeeks }).map((_, index) => {
        const week = index + 1;
        return (
          <td key={week}>
            <input
              type="number"
              value={weekly[week] ?? ""}
              onChange={(e) => updateWeek(week, e.target.value)}
              className={styles.input}
              style={{
                borderColor: isInvalid ? "red" : "#ccc",
              }}
            />
          </td>
        );
      })}
    </tr>
  );
}
