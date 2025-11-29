"use client";

import { Module } from "@/types/program";
import styles from "./ModuleRow.module.css";

type Props = {
  module: Module;
  totalWeeks: number;
  weekly?: Record<number, number>;
  onWeekChange: (moduleId: string, week: number, value: string) => void;
  onSave: (moduleId: string) => void;
};

const typeLabels: Record<Module["type"], string> = {
  professional: "დარგობრივი",
  general: "ზოგადი",
  commonProfessional: "საერთო დარგობრივი",
  integratedGeneral: "ინტეგრირებული ზოგადი",
};

export default function ModuleRow({
  module,
  totalWeeks,
  weekly = {},
  onWeekChange,
  onSave,
}: Props) {
  const totalRequired = module.contactHours + module.assessmentHours;
  const sum = Object.values(weekly || {}).reduce((acc, v) => acc + v, 0);
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
              value={weekly[week] ?? ""}
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
