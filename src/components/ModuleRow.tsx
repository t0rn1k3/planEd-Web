"use client";

import { Module } from "@/types/program";
import styles from "./ModuleRow.module.css";

type Props = {
  module: Module;
  totalWeeks: number;
  weekly: Record<number, number>;
  onWeekChange: (moduleId: string, week: number, value: string) => void;
  onSave: (moduleId: string) => void;
  colorIndex: number;
};

const typeLabels: Record<Module["type"], string> = {
  professional: "დარგობრივი",
  general: "ზოგადი",
  commonProfessional: "საერთო დარგობრივი",
  integratedGeneral: "ინტეგრირებული ზოგადი",
};

function getDistributedFallback(module: Module): Record<number, number> {
  const total = module.contactHours + module.assessmentHours;
  const duration = module.durationWeeks;
  const start = module.startWeek ?? 1;


  const base = Math.floor(total / duration);
  const remainder = total % duration;
  const result: Record<number, number> = {};

  for (let i = 1; i < start; i++) {
    result[i] = 0;
  }

  for (let i = 0; i < duration; i++) {
    const week = start + i;
    result[week] = base + (i < remainder ? 1 : 0);
  }

  return result;
}

export default function ModuleRow({
  module,
  totalWeeks,
  weekly,
  onWeekChange,
  onSave,
  colorIndex,
}: Props) {
  const colorClasses = [styles.rowColor1, styles.rowColor2, styles.rowColor3];
  const colorClass = colorClasses[colorIndex];


    const endWeek = module.startWeek + module.durationWeeks - 1;

  const weeklyWithFallback =
    Object.keys(weekly ?? {}).length === 0
      ? getDistributedFallback(module)
      : weekly;

  const totalRequired = module.contactHours + module.assessmentHours;
  const sum = Object.entries(weeklyWithFallback).filter(([week])=>{
    const w = Number(week)
    return w>= module.startWeek && w<= endWeek
  }).reduce((acc, [ , v]) => acc + Number(v || 0), 0)
  const isInvalid = sum !== totalRequired;

  return (
    <tr>
      <td style={{ color: "initial" }}>{module.code}</td>
      <td className={styles.moduleNameCell} style={{ color: "initial" }}>{module.name}</td>
      <td style={{ color: "initial" }}>{typeLabels[module.type]}</td>

      <td style={{ color: isInvalid ? "red" : "initial" }}>
        {module.contactHours + module.independentHours + module.assessmentHours}
      </td>
      <td style={{ color: isInvalid ? "red" : "initial" }}>
        {module.contactHours}
      </td>
      <td style={{ color: "initial" }}>{module.independentHours}</td>
      <td style={{ color: isInvalid ? "red" : "initial" }}>
        {module.assessmentHours}
      </td>
      <td style={{ color: "initial" }}>{module.durationWeeks}</td>
      <td style={{ color: "initial" }}>{module.credits}</td>

      {Array.from({ length: totalWeeks }).map((_, index) => {
        const week = index + 1;
        const value = weeklyWithFallback[week] || 0;
        return (
          <td key={week} className={value > 0 ? colorClass : undefined} style={{ color: "initial" }}>
            <input
              type="number"
              value={value === 0 ? "" : value}
              onChange={(e) => onWeekChange(module.id, week, e.target.value)}
              className={styles.input}
              style={{
                borderColor: isInvalid ? "red" : "#ccc",
                color: "initial",
              }}
            />
          </td>
        );
      })}

      <td>
        <button
          onClick={() => onSave(module.id)}
          disabled={isInvalid}
          className={styles.saveButton}
        >
          Save
        </button>
      </td>
    </tr>
  );
}
