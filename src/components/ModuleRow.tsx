"use client";

import { Module } from "@/types/program";
import styles from "./ModuleRow.module.css";

type Props = {
  module: Module;
  totalWeeks: number;
  weekly: Record<number, number>;
  onWeekChange: (moduleId: string, week: number, value: string) => void;
  onSave: (moduleId: string) => void;
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
}: Props) {
  const weeklyWithFallback =
    Object.keys(weekly ?? {}).length === 0
      ? getDistributedFallback(module)
      : weekly;

  const totalRequired = module.contactHours + module.assessmentHours;
  const sum = Object.values(weeklyWithFallback).reduce((acc, v) => acc + v, 0);
  const isInvalid = sum !== totalRequired;

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
              value={
                weeklyWithFallback[week] === 0 ? "" : weeklyWithFallback[week]
              }
              onChange={(e) => onWeekChange(module.id, week, e.target.value)}
              className={styles.input}
              style={{
                borderColor: isInvalid ? "red" : "#ccc",
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
